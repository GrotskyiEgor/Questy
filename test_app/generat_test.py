import openai
import dotenv
import os

dotenv.load_dotenv()
OPENAI_SECRET_KEY = os.getenv("OPENAI_SECRET_KEY")
client_openai = openai.AsyncOpenAI(api_key= OPENAI_SECRET_KEY)

async def generate_test(topic: str, description:str, count_question: int, aswer_on_question: int):
    """
    функція яка отримує відповідь від штучного інтелекту за допомогою моделі gpt-4o-mini
    """
    promt = "Привіт, створи мені тест простий на тему Python, який включає в себе 5 питань. На кожне питання у чата є відповіді, три які з них - не правильні, а лише одна правильна"
    
    response = await client_openai.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{
            "role": "user",
            "content": ''
        }]
    )
   
    return response.choices[0].message.content 



