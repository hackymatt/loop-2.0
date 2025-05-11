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
    result = subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = result.communicate()

    return {
        "stdout": stdout.strip(),
        "stderr": stderr.strip(),
        "exit_code": result.returncode,
    }

def _run_command_streaming(command, cwd):
    result = subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout_lines = []
    stderr_lines = []

    while True:
        output = result.stdout.readline()
        error = result.stderr.readline()
        if output:
            stdout_lines.append(output.strip())
            yield {"stdout": stdout_lines, "stderr": stderr_lines}
        if error:
            stderr_lines.append(error.strip())
            yield {"stdout": stdout_lines, "stderr": stderr_lines}
        if output == '' and error == '' and result.poll() is not None:
            break

def run_command(command, cwd, stream_output=False):
    try:
        if stream_output:
            return _run_command_streaming(command, cwd)
        else:
            return _run_command_non_streaming(command, cwd)
    except Exception as e:
        return {"error": str(e)}

def process_job(body):
    try:
        payload = json.loads(body)
        print(body)
        job_id = payload.get("job_id")
        files = payload.get("files", {})
        command = payload.get("command")
        stream = payload.get("stream", False)

        print("Stream output:", stream)

        if not job_id or not files or not command:
            return {"error": "Missing required fields: job_id, files, or command"}

        job_dir = Path("jobs") / job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        write_files(job_dir, files)

        print(f"Files written to {job_dir}")

        result = run_command(command, cwd=job_dir, stream_output=stream)
        
        if isinstance(result, GeneratorType):
            result = list(result)  # Collect all items in the generator

        return result

    except Exception as e:
        return {"error": str(e)}