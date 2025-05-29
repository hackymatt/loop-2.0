import json
import os
import textwrap
from types import GeneratorType
import requests
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_MODEL = "gpt-3.5-turbo"


def _build_headers():
    return {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }


def _build_payload(system_prompt, user_prompt, stream=False):
    return {
        "model": OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0,
        "max_tokens": 2000,
        "stream": stream,
    }


def send_openai_chat(system_prompt, user_prompt, timeout, stream_output=False):
    payload = _build_payload(system_prompt, user_prompt, stream=stream_output)
    headers = _build_headers()

    try:
        response = requests.post(
            OPENAI_API_URL,
            headers=headers,
            json=payload,
            timeout=timeout,
            stream=stream_output,
        )
        response.raise_for_status()

        return (
            _parse_streaming_response(response)
            if stream_output
            else _parse_non_streaming_response(response)
        )

    except requests.exceptions.RequestException as e:
        return {"stdout": "", "stderr": str(e), "exit_code": 1}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "exit_code": 1}


def _parse_non_streaming_response(response):
    try:
        result = response.json()
        content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"stdout": "", "stderr": content, "exit_code": 1}
    except json.JSONDecodeError as e:
        return {"stdout": "", "stderr": f"Failed to parse response: {str(e)}", "exit_code": 1}


def _parse_streaming_response(response):
    buffer = ""
    for line in response.iter_lines():
        if line and line.startswith(b"data: "):
            data_str = line[len(b"data: ") :].decode("utf-8")
            if data_str == "[DONE]":
                break
            try:
                data = json.loads(data_str)
                delta = data["choices"][0].get("delta", {})
                content = delta.get("content", "")
                buffer += content
                while "\n" in buffer:
                    line_output, buffer = buffer.split("\n", 1)
                    line_output = line_output.strip()
                    if line_output:
                        yield {"stdout": [line_output], "stderr": []}
            except json.JSONDecodeError:
                continue

    if buffer.strip():
        yield {"stdout": [buffer.strip()], "stderr": []}


def process_job(body):
    try:
        payload = json.loads(body)
        job_id = payload.get("job_id")
        files = payload.get("files", [])
        timeout = payload.get("timeout", 10)
        command = payload.get("command")
        language = payload.get("language", "pl")
        technology = payload.get("technology")
        stream = payload.get("stream", False)

        if not job_id or not files or not command:
            raise ValueError("Missing required fields: job_id, files or command")

        file_blocks = "\n\n".join(
            f"' File: {(file.get('path') + '/' if file.get('path') else '')}{file['name']}\n{file['code']}"
            for file in files
        )

        user_prompt = textwrap.dedent(
            f"""\
            Here is the {technology} code I want to run:
            {file_blocks}
            The command is: {command}
            Please execute this command as if you were running the code in a {technology} environment,
            and return the output or result.
        """
        )

        system_prompt = textwrap.dedent(
            f"""\
            You are an expert {technology} interpreter.
            Simulate the execution of the provided {technology} code.
            If the code contains errors (e.g., syntax or runtime errors), include them in the `stderr` field and set `exit_code` to a non-zero value.
            Respond in JSON format with:
            - `stdout`: normal program output
            - `stderr`: error messages
            - `exit_code`: 0 for success, or appropriate non-zero code for failure
            Respond in {language}. Do not wrap the response in triple backticks or markdown formatting.
        """
        )

        result = send_openai_chat(system_prompt, user_prompt, timeout, stream)

        return list(result) if isinstance(result, GeneratorType) else result

    except Exception as e:
        return {"error": str(e)}
