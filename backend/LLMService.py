import google.generativeai as genai
from typing import Dict

import chat_history
import message_attributes


class LLMService:
    def __init__(self, api_key: str, model_name: str = 'gemini-1.5-flash'):
        """
        Initialize LLMService with API key and the model
        """
        genai.configure(api_key=api_key)
        self.model_name = model_name
        self.sessions: Dict[str, genai.ChatSession] = {}
        self.prompt_correction_model = genai.GenerativeModel(
            self.model_name,
            system_instruction=["""You are an assistant that corrects spelling, 
                                grammatical, and punctuation errors in the user's
                                prompt. Return only the corrected version of the
                                prompt, without any additional text or explanation."""]
        )


    async def get_session(self, user_id: str) -> genai.ChatSession:
        """
        Retrieve user's chat session or create a new one if they haven't started one yet
        """
        if user_id not in self.sessions:
            model = genai.GenerativeModel(
                self.model_name,
                system_instruction=["""You are a helpful cardiovascular health expert, 
                        who focuses on lifestyle changes and can answer questions in 
                        Finnish or English depending on the question's language."""],
                tools=[message_attributes.save_user_age,
                       message_attributes.save_user_weight,
                       message_attributes.save_user_height,
                       message_attributes.save_user_gender,
                       message_attributes.save_user_systolic_blood_pressure,
                       message_attributes.save_user_diastolic_blood_pressure,
                       message_attributes.save_user_heart_rate,
                       message_attributes.save_user_total_cholesterol,
                       message_attributes.save_user_low_density_lipoprotein,
                       message_attributes.save_user_high_density_lipoprotein,
                       message_attributes.save_user_triglycerides,
                       message_attributes.save_user_smoking,
                       message_attributes.save_user_alcohol_consumption,
                       message_attributes.save_user_sleep,
                       message_attributes.save_user_medical_conditions
                       ],
                tool_config={"function_calling_config": {"mode": "auto"}}
            )
            self.sessions[user_id] = model.start_chat(history=await chat_history.load_history(user_id))
        return self.sessions[user_id]


    async def send_message(self, user_id: str, question: str) -> {}:
        """
        Asks question from AI model and returns the answer + possible attributes
        """
        session = await self.get_session(user_id)
        response = session.send_message(question)

        # If response contains function calls, return them as attributes
        if response and len(response.candidates[0].content.parts) > 1:
            attributes = []

            for part in response.candidates[0].content.parts[1:]:
                attribute = {}
                for key, value in part.function_call.args.items():
                    attribute[key] = value
                attributes.append(attribute)

            answer = response.candidates[0].content.parts[0].text
            chat_history.store_history(user_id, question, answer)

            return {"response": answer, "attributes": attributes}

        elif response and response.text:
            chat_history.store_history(user_id, question, response.text)

            return {"response": response.text}

        else:
            return {"response": "Error: No response from model."}


    def correct_prompt(self, prompt: str) -> str:
        """
        Fixes spelling, grammatical and punctuation errors in the user given prompt
        """
        response = self.prompt_correction_model.generate_content(prompt)
        return response.text if response else None