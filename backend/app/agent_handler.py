import requests
from datetime import datetime

class Agent:
    def __init__(self, model, api_url="http://localhost:11434"):
        self.model = model
        self.api_url = api_url
        self.conversation_history = []

    def send_message(self, user_input, save_to_file=False, file_path="conversation_history.txt"):
        # Adiciona entrada do utilizador ao histórico
        self.conversation_history.append({"role": "user", "content": user_input})

        # Prepara o histórico num formato plano (apenas o texto das mensagens anteriores)
        full_prompt = self._build_prompt()

        # Envia o pedido para o servidor Ollama
        try:
            response = requests.post(
                f"{self.api_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": full_prompt,
                    "stream": False
                }
            )
            response.raise_for_status()
            assistant_reply = response.json()["response"]

            # Guarda a resposta no histórico
            self.conversation_history.append({"role": "assistant", "content": assistant_reply})

            # Se o utilizador quiser guardar a conversa
            if save_to_file:
                self._save_history_to_file(file_path)

            return assistant_reply

        except requests.RequestException as e:
            return f"[ERRO] Falha na comunicação com Ollama: {e}"

    def _build_prompt(self):
        # Constrói o prompt com base no histórico (formato simples)
        prompt = ""
        for entry in self.conversation_history:
            role = "User" if entry["role"] == "user" else "Assistant"
            prompt += f"{role}: {entry['content']}\n"
        prompt += "Assistant: "
        return prompt

    def _save_history_to_file(self, file_path):
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(f"\n=== Conversa iniciada em {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n")
            for entry in self.conversation_history:
                f.write(f"{entry['role'].capitalize()}: {entry['content']}\n")
            f.write("\n=== Fim da conversa ===\n\n")
