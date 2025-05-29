import json
import requests
from unittest.mock import patch, MagicMock
from utils import send_openai_chat, process_job


def test_send_openai_chat_request_exception():
    with patch("requests.post") as mock_post:
        mock_post.side_effect = requests.exceptions.RequestException("Network error")

        result = send_openai_chat(
            system_prompt="You are a Python interpreter.",
            user_prompt="print('Hello, world!')",
            timeout=10,
        )

        assert result["stdout"] == ""
        assert "Network error" in result["stderr"]
        assert result["exit_code"] == 1


def test_send_openai_chat_json_decode_error():
    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.side_effect = json.JSONDecodeError(
            "Expecting value", "", 0
        )

        result = send_openai_chat(
            system_prompt="You are a Python interpreter.",
            user_prompt="print('Hello, world!')",
            timeout=10,
        )

        assert result["stdout"] == ""
        assert "Failed to parse response" in result["stderr"]
        assert result["exit_code"] == 1


def test_send_openai_chat_generic_exception():
    with patch("requests.post") as mock_post:
        mock_post.side_effect = Exception("Unexpected error")

        result = send_openai_chat(
            system_prompt="You are a Python interpreter.",
            user_prompt="print('Hello, world!')",
            timeout=10,
        )

        assert result["stdout"] == ""
        assert "Unexpected error" in result["stderr"]
        assert result["exit_code"] == 1


def test_send_openai_chat_success():
    mock_response = {
        "choices": [
            {
                "message": {
                    "content": json.dumps(
                        {"stdout": "Hello, world!", "stderr": "", "exit_code": 0}
                    )
                }
            }
        ]
    }

    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_response

        result = send_openai_chat(
            system_prompt="You are a Python interpreter.",
            user_prompt="print('Hello, world!')",
            timeout=10,
        )

        assert result["stdout"] == "Hello, world!"
        assert result["stderr"] == ""
        assert result["exit_code"] == 0


def test_send_openai_chat_error():
    with patch("requests.post") as mock_post:
        mock_post.side_effect = Exception("API request failed")

        result = send_openai_chat(
            system_prompt="You are a Python interpreter.",
            user_prompt="print('Hello, world!')",
            timeout=10,
        )

        assert result["stdout"] == ""
        assert "API request failed" in result["stderr"]
        assert result["exit_code"] == 1


def test_process_job_success():
    mock_response = {
        "choices": [
            {
                "message": {
                    "content": json.dumps(
                        {"stdout": "Execution successful", "stderr": "", "exit_code": 0}
                    )
                }
            }
        ]
    }

    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_response

        payload = {
            "job_id": "test123",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Hello, world!')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
        }

        body = json.dumps(payload)
        result = process_job(body)

        assert result["stdout"] == "Execution successful"
        assert result["stderr"] == ""
        assert result["exit_code"] == 0


def test_process_job_error():
    mock_response = {
        "choices": [
            {
                "message": {
                    "content": json.dumps(
                        {
                            "stdout": "",
                            "stderr": "SyntaxError: invalid syntax",
                            "exit_code": 1,
                        }
                    )
                }
            }
        ]
    }

    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_response

        payload = {
            "job_id": "test123",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Hello world'"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
        }

        body = json.dumps(payload)
        result = process_job(body)

        assert result["stdout"] == ""
        assert "SyntaxError" in result["stderr"]
        assert result["exit_code"] == 1


def test_process_job_missing_fields():
    payload = {"job_id": "test123", "files": []}
    result = process_job(json.dumps(payload))
    assert "error" in result


def test_process_job_streaming():
    stream_lines = [
        b'data: {"choices":[{"delta":{"content":"line 1\\n"}}]}',
        b'data: {"choices":[{"delta":{"content":"line 2\\n"}}]}',
        b"data: [DONE]",
    ]

    mock_response = MagicMock()
    mock_response.iter_lines.return_value = stream_lines
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None

    with patch("requests.post", return_value=mock_response):
        payload = {
            "job_id": "test_streaming",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Streaming test')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
            "stream": True,
        }

        body = json.dumps(payload)
        results = process_job(body)

        assert isinstance(results, list)
        assert results == [
            {"stdout": ["line 1"], "stderr": []},
            {"stdout": ["line 2"], "stderr": []},
        ]


def test_process_job_generic_exception():
    invalid_payload = "invalid_json"
    result = process_job(invalid_payload)

    assert "error" in result
    assert "Expecting value" in result["error"]

def test_send_openai_chat_invalid_inner_json():
    mock_response = {
        "choices": [
            {
                "message": {
                    "content": "not a json string"
                }
            }
        ]
    }

    with patch("requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = mock_response

        result = send_openai_chat(
            system_prompt="Interpreter",
            user_prompt="print('Hi')",
            timeout=10,
        )

        assert result["stdout"] == ""
        assert "not a json string" in result["stderr"]
        assert result["exit_code"] == 1

def test_process_job_missing_command():
    payload = {
        "job_id": "test_missing_command",
        "files": [{"name": "script.py", "code": "print('x')"}],
        "timeout": 10,
        "language": "en",
        "technology": "Python"
    }

    result = process_job(json.dumps(payload))
    assert "error" in result
    assert "command" in result["error"]

def test_process_job_missing_files():
    payload = {
        "job_id": "test_missing_files",
        "command": "python script.py",
        "timeout": 10,
        "language": "en",
        "technology": "Python"
    }

    result = process_job(json.dumps(payload))
    assert "error" in result
    assert "files" in result["error"]

def test_parse_streaming_response_yields_leftover_buffer():
    # Mock response.iter_lines to yield content lines without trailing newline
    stream_lines = [
        b'data: {"choices":[{"delta":{"content":"partial line"}}]}',
        b'data: [DONE]',
    ]

    mock_response = MagicMock()
    mock_response.iter_lines.return_value = stream_lines
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None

    with patch("requests.post", return_value=mock_response):
        payload = {
            "job_id": "test_streaming",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Streaming test')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
            "stream": True,
        }

        body = json.dumps(payload)
        results = process_job(body)

        assert isinstance(results, list)

        assert results == [
            {"stdout": ["partial line"], "stderr": []},
        ]


def test_parse_streaming_response_yields_no_lines():
    mock_response = MagicMock()
    mock_response.iter_lines.return_value = []
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None

    with patch("requests.post", return_value=mock_response):
        payload = {
            "job_id": "test_streaming",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Streaming test')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
            "stream": True,
        }

        body = json.dumps(payload)
        results = process_job(body)

        assert isinstance(results, list)

        assert results == []

def test_parse_streaming_response_missing_data():
    # Mock response.iter_lines to yield content lines without trailing newline
    stream_lines = [
        b'data: {"choices":[{"delta":{"content":"partial line"}}]}',
        b'daata: {"choices":[{"delta":{"content":"partial line"}}]}',
        b'data: [DONE]',
    ]

    mock_response = MagicMock()
    mock_response.iter_lines.return_value = stream_lines
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None

    with patch("requests.post", return_value=mock_response):
        payload = {
            "job_id": "test_streaming",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Streaming test')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
            "stream": True,
        }

        body = json.dumps(payload)
        results = process_job(body)

        assert isinstance(results, list)

        assert results == [
            {"stdout": ["partial line"], "stderr": []},
        ]


def test_parse_streaming_response_invalid_json():
    # Mock response.iter_lines to yield content lines without trailing newline
    stream_lines = [
        b'data: {"choices":[{"delta":{"content":"partial line"}}]}',
        b'data: {"choices":[{"delta":{"content":"partial line"}]}',
        b'data: [DONE]',
    ]

    mock_response = MagicMock()
    mock_response.iter_lines.return_value = stream_lines
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None

    with patch("requests.post", return_value=mock_response):
        payload = {
            "job_id": "test_streaming",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Streaming test')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
            "stream": True,
        }

        body = json.dumps(payload)
        results = process_job(body)

        assert isinstance(results, list)

        assert results == [
            {"stdout": ["partial line"], "stderr": []},
        ]

def test_parse_streaming_response_no_newline():
    # Mock response.iter_lines to yield content lines without trailing newline
    stream_lines = [
        b'data: {"choices":[{"delta":{"content":"line 1\\n\\n"}}]}',
        b'data: [DONE]',
    ]

    mock_response = MagicMock()
    mock_response.iter_lines.return_value = stream_lines
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None

    with patch("requests.post", return_value=mock_response):
        payload = {
            "job_id": "test_streaming",
            "files": [
                {"name": "script.py", "path": None, "code": "print('Streaming test')"}
            ],
            "command": "python script.py",
            "timeout": 10,
            "language": "en",
            "technology": "Python",
            "stream": True,
        }

        body = json.dumps(payload)
        results = process_job(body)

        assert isinstance(results, list)

        assert results == [{'stdout': ['line 1'], 'stderr': []}]

