Header Authorization webhook:
key: x-api-key
value: N8N_API_KEY set in .env.local


Contact Form:
-------------------

Webhook URL: https://n8n.zeeshanai.cloud/webhook/bac41859-89f0-4720-b3cd-37328cfbfce1
Type: POST

Body:
{
  "name": "zeeshan",
  "email": "zeeshan@example.com",
  "message": "Good app!"
}

Responses:

Successful Response:
{
  "success": true,
  "status": "CONTACT_SUBMITTED",
  "message": "Your message has been received successfully"
}