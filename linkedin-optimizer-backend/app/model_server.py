# linkedin-optimizer-backend/app/model_server.py

import os
import asyncio
from typing import Optional
from llama_cpp import Llama

class ModelServer:
    def __init__(self):
        self._llm: Optional[Llama] = None
        self._lock = asyncio.Lock()

    def load(self):
        """
        Load model only when needed.
        Path must come from environment variable.
        """
        if self._llm is not None:
            return

        model_path = os.getenv("LLM_MODEL_PATH")

        if not model_path:
            raise RuntimeError(
                "LLM_MODEL_PATH environment variable is not set"
            )

        if not os.path.isfile(model_path):
            raise RuntimeError(
                f"LLM model file not found at: {model_path}"
            )

        self._llm = Llama(
            model_path=model_path,
            n_ctx=int(os.getenv("LLM_N_CTX", "2048"))
        )

    async def generate(self, prompt: str, max_tokens=256, temperature=0.2):
        async with self._lock:
            if self._llm is None:
                self.load()

            loop = asyncio.get_running_loop()

            def _run():
                return self._llm.create_completion(
                    prompt=prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )

            result = await loop.run_in_executor(None, _run)
            return result["choices"][0]["text"]


server = ModelServer()
