WEBHOOK DEMO COMMANDS FOR LOOM VIDEO:

Function Call (WORKS PERFECTLY - Use This):

curl -X POST https://receptionist-agent.vercel.app/api/function-call -H "Content-Type: application/json" -d "{\"function_name\":\"find_employee\",\"arguments\":{\"employee_name\":\"Sarah Johnson\"}}"

Alternative Employee Lookup:

curl -X POST https://receptionist-agent.vercel.app/api/function-call -H "Content-Type: application/json" -d "{\"function_name\":\"find_employee\",\"arguments\":{\"employee_name\":\"Mike Chen\"}}"

Test Different Employee:

curl -X POST https://receptionist-agent.vercel.app/api/function-call -H "Content-Type: application/json" -d "{\"function_name\":\"find_employee\",\"arguments\":{\"employee_name\":\"Lisa Wang\"}}"



WEBHOOK DEMO COMMANDS - COMPLETE SET:

Pre-Call:

curl -X POST https://receptionist-agent.vercel.app/api/pre-call -H "Content-Type: application/json" -d "{\"call_id\":\"demo_123\",\"from_number\":\"+1234567890\",\"agent_id\":\"bot_001\"}"

Function Call:

curl -X POST https://receptionist-agent.vercel.app/api/function-call -H "Content-Type: application/json" -d "{\"function_name\":\"find_employee\",\"arguments\":{\"employee_name\":\"Sarah Johnson\"}}"

Post-Call:

curl -X POST https://receptionist-agent.vercel.app/api/post-call -H "Content-Type: application/json" -d "{\"visitor_name\":\"John Smith\",\"employee_visited\":\"Sarah Johnson\",\"purpose\":\"Meeting\",\"status\":\"completed\"}"
