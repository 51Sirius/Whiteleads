from datetime import datetime

from aiohttp import ClientSession



async def get_vacancy(vacancy_id: str) -> dict[str, str]:
    async with ClientSession() as session:
        async with session.get(f"https://api.hh.ru/vacancies/{vacancy_id}") as response:
            response_json = await response.json()
            if response.status != 200:
                return None
            address = response_json["address"]
            return {
                "title": response_json["name"],
                "description": response_json["description"],
                "archived": response_json["archived"],
                "company_name": response_json["employer"]["name"],
                "company_logo": response_json["employer"]["logo_urls"].get(
                    "original"
                ),
                "company_address": (
                    f"{address['city']}, {address['street']}, {address['building']}"
                    if address is not None
                    else response_json["area"]["name"]
                ),
                "vacancy_created_at": response_json["initial_created_at"][:10]
            }