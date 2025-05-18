import json
import subprocess
from pathlib import Path
from types import GeneratorType
from threading import Timer


def write_files(job_dir, files):
    for file in files:
        name = file["name"]
        path = file["path"]
        code = file["code"]
        rel_path = f"{path}/{name}" if path else name
        file_path = job_dir / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(code)


def _run_command_non_streaming(command, timeout, cwd):
    proc = subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    try:
        stdout, stderr = proc.communicate(timeout=timeout)
        return {
            "stdout": stdout.strip(),
            "stderr": stderr.strip(),
            "exit_code": proc.returncode,
        }
    except subprocess.TimeoutExpired:
        proc.kill()
        stdout, stderr = proc.communicate()
        return {
            "stdout": stdout.strip(),
            "stderr": (stderr.strip() + "\n[ERROR] TimeoutExpired").strip(),
            "exit_code": -9,
        }


def _run_command_streaming(command, timeout, cwd):
    proc = subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    timer = Timer(timeout, proc.kill)

    try:
        while True:
            out_line = proc.stdout.readline()
            err_line = proc.stderr.readline()

            if out_line:
                yield {"stdout": [out_line.strip()], "stderr": []}
            if err_line:
                yield {"stdout": [], "stderr": [err_line.strip()]}

            # exit when no more data and process is done
            if not out_line and not err_line and proc.poll() is not None:
                break
    finally:
        timer.cancel()

    if proc.returncode == -9:
        yield {"stdout": [], "stderr": ["[ERROR] TimeoutExpired"]}


def run_command(command, timeout, cwd, stream_output=False):
    if stream_output:
        return _run_command_streaming(command, timeout, cwd)
    return _run_command_non_streaming(command, timeout, cwd)


def process_job(body):
    try:
        payload = json.loads(body)
        job_id = payload.get("job_id")
        files = payload.get("files", [])
        timeout = payload.get("timeout", 10)  # seconds
        command = payload.get("command")
        stream = payload.get("stream", False)

        print("Stream output:", stream)

        if not job_id or not files or not timeout or not command:
            raise ValueError(
                "Missing required fields: job_id, files, timeout or command"
            )

        job_dir = Path("jobs") / job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        write_files(job_dir, files)

        print(f"Files written to {job_dir}")

        result = run_command(command, timeout, cwd=job_dir, stream_output=stream)

        if isinstance(result, GeneratorType):
            result = list(result)  # Collect all items in the generator

        return result

    except Exception as error:
        return {"error": str(error)}
