import shutil
import tempfile
import time
import pytest
import json
from pathlib import Path
from types import GeneratorType
from ..utils import write_files, run_command, process_job


def test_write_files():
    tmp_dir = Path(tempfile.mkdtemp())
    files = {
        "file1.txt": "hello",
        "nested/dir/file2.txt": "world",
    }

    write_files(tmp_dir, files)

    assert (tmp_dir / "file1.txt").read_text() == "hello"
    assert (tmp_dir / "nested/dir/file2.txt").read_text() == "world"

    shutil.rmtree(tmp_dir)


def test_run_command_non_streaming():
    tmp_dir = Path(tempfile.mkdtemp())
    (tmp_dir / "test.sh").write_text("echo hello")

    result = run_command("bash test.sh", cwd=tmp_dir, stream_output=False)

    assert result["stdout"] == "hello"
    assert result["stderr"] == ""
    assert result["exit_code"] == 0

    shutil.rmtree(tmp_dir)


def test_process_job_non_streaming():
    tmp_dir = tempfile.mkdtemp()
    payload = {
        "job_id": "test123",
        "files": {"script.sh": "echo hello"},
        "command": "bash script.sh",
        "stream": False,
    }

    import json

    body = json.dumps(payload)
    result = process_job(body)

    assert isinstance(result, dict)
    assert result["stdout"] == "hello"
    assert result["exit_code"] == 0

    shutil.rmtree("jobs/test123", ignore_errors=True)


def test_process_job_missing_fields():
    payload = {"job_id": "test123", "files": {}}
    import json

    result = process_job(json.dumps(payload))
    assert "error" in result


def test_run_command_streaming():
    # This test simulates a command that generates output progressively
    tmp_dir = Path(tempfile.mkdtemp())
    (tmp_dir / "test.sh").write_text(
        """
for i in {1..3}; do 
    echo line $i
done
# Intentional error
cd /nonexistent_directory
"""
    )

    result_gen = run_command("bash test.sh", cwd=tmp_dir, stream_output=True)

    # Since the output is streamed, we collect all yielded lines
    result = list(result_gen)

    # Flatten the stdout and stderr from all the yielded dictionaries into separate lists
    stdout_lines = [line for result_item in result for line in result_item["stdout"]]
    stderr_lines = [line for result_item in result for line in result_item["stderr"]]

    # Expected output
    expected_stdout = ["line 1", "line 2", "line 3"]
    expected_stderr = [
        "test.sh: line 6: cd: /nonexistent_directory: No such file or directory"
    ]

    # Check if the output contains the expected lines
    assert stdout_lines == expected_stdout
    assert stderr_lines == expected_stderr

    shutil.rmtree(tmp_dir)


def test_process_job_streaming():
    payload = {
        "job_id": "test123",
        "files": {"script.sh": "for i in {1..3}; do echo line $i; done"},
        "command": "bash script.sh",
        "stream": True,  # Set stream to True to test streaming case
    }
    body = json.dumps(payload)

    # Execute the job and process the result
    result = process_job(body)

    # Check that the result contains streamed output
    assert isinstance(
        result, list
    )  # Since it's streamed, result should be a list of dicts
    assert len(result) > 0
    assert "stdout" in result[0]  # Ensure the output contains 'stdout' key
    assert result[0]["stdout"] == ["line 1"]


def test_process_job_streaming_no_output():
    payload = {
        "job_id": "test123",
        "files": {"script.sh": "for i in {1..3}; do sleep 1; done"},
        "command": "bash script.sh",
        "stream": True,  # Streaming enabled
    }
    body = json.dumps(payload)

    result = process_job(body)

    # Since the script doesn't produce output, we expect an empty stdout list or something else
    assert isinstance(result, list)
    assert len(result) == 0


def test_process_job_error():
    payload = {
        "job_id": "test123",
        "files": {"script.sh": "for i in {1..3}; do sleep 1; done"},
        "stream": True,  # Streaming enabled
    }
    body = json.dumps(payload)

    result = process_job(body)

    assert "error" in result
