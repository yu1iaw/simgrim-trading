import { ExpoRequest, ExpoResponse } from 'expo-router/server';


const CRYPTO_API_KEY = process.env.CRYPTO_API_KEY!;

export async function GET(request: ExpoRequest) {
    const ids = request.expoUrl.searchParams.get('ids');

    const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ids}`, {
        headers: {
            'X-CMC_PRO_API_KEY': CRYPTO_API_KEY
        }
    });

    const result = await response.json();
    return ExpoResponse.json(result.data);
}

