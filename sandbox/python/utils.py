import json
import subprocess
from pathlib import Path
from types import GeneratorType


def write_files(job_dir, files):
    for rel_path, content in files.items():
        file_path = job_dir / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content)


def _run_command_non_streaming(command, cwd):
    with subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    ) as result:
        stdout, stderr = result.communicate()

    return {
        "stdout": stdout.strip(),
        "stderr": stderr.strip(),
        "exit_code": result.returncode,
    }


def _run_command_streaming(command, cwd):
    with subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    ) as result:
        while True:
            output = result.stdout.readline()
            error = result.stderr.readline()

            if output:
                yield {"stdout": [output.strip()], "stderr": []}
            if error:
                yield {"stdout": [], "stderr": [error.strip()]}

            if output == "" and error == "" and result.poll() is not None:
                break


def run_command(command, cwd, stream_output=False):
    if stream_output:
        return _run_command_streaming(command, cwd)
    return _run_command_non_streaming(command, cwd)


def process_job(body):
    try:
        payload = json.loads(body)
        job_id = payload.get("job_id")
        files = payload.get("files", {})
        command = payload.get("command")
        stream = payload.get("stream", False)

        print("Stream output:", stream)

        if not job_id or not files or not command:
            raise ValueError("Missing required fields: job_id, files, or command")

        job_dir = Path("jobs") / job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        write_files(job_dir, files)

        print(f"Files written to {job_dir}")

        result = run_command(command, cwd=job_dir, stream_output=stream)

        if isinstance(result, GeneratorType):
            result = list(result)  # Collect all items in the generator

        return result

    except Exception as error:
        return {"error": str(error)}
