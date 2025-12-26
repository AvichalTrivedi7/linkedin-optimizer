# backend/app/model_server.py
import os
import asyncio
from typing import Optional
from llama_cpp import Llama

MODEL_PATH = os.getenv("MODEL_PATH", "models/mistral-7b.gguf")  # change to your local path
MODEL_N_CTX = int(os.getenv("MODEL_N_CTX", "2048"))

class ModelServer:
    def __init__(self):
        self._llm: Optional[Llama] = None
        self._lock = asyncio.Lock()   # serialize requests to avoid OOM / race conditions

    def load(self):
        if self._llm is None:
            # Llama() accepts gguf model paths for llama-cpp python
            self._llm = Llama(model_path=MODEL_PATH, n_ctx=MODEL_N_CTX)
        return self._llm is not None

    async def generate(self, prompt: str, max_tokens: int = 256, temperature: float = 0.2):
        """
        Acquire lock and call llama-cpp synchronous API inside a thread to avoid blocking event loop.
        """
        # ensure loaded
        if self._llm is None:
            self.load()

        async with self._lock:
            # llama-cpp-python's create_completion is synchronous — run in threadpool
            import asyncio
            loop = asyncio.get_running_loop()
            def _call():
                # tune params as you like
                resp = self._llm.create_completion(
                    prompt=prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=0.95,
                    stop=None
                )
                return resp
            result = await loop.run_in_executor(None, _call)
            # extract text — check returned structure
            # create_completion returns dict with 'choices'[0]['text']
            text = ""
            try:
                text = result["choices"][0]["text"]
            except Exception:
                text = str(result)
            return {"raw": result, "text": text}

# create a module-level singleton
server = ModelServer()
