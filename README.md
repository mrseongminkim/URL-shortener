# Estimation and Constraints
## Traffic
한 번 write된 URL은 공유되어 여러 번 read된다.<br>
100 : 1 read/write ratio<br>
달에 만들어지는 unique한 shortened url의 개수 = 100 * 10^6<br>
1초에 만들어지는 unique한 shortened url의 개수 = (100 * 10^6) / (30일 * 24시간 * 60분 * 60초) ~= 40 URLs/second as Requests Per Second(RPS)<br>
1초에 redirect되는 url의 개수 = 40 URLs/second * 100 = 4000 URLs/second<br>

## Storage
서비스가 100년동안 가동한다.<br>
총 만들어질 데이터의 개수 = 100년 * 12달 * 100 * 10^6 = 12 * 10^9<br>
각각의 데이터의 크기를 500 bytes라 한다.<br>
총 필요한 메모리의 크기 = 12 * 10^9 * 500 bytes = 6 * 10^12 Bytes = 6TB<br>

## Memory
Pareto Principle를 따르는 cache system을 구현한다.<br>
request per day = 4000 req/s * 86400s ~= 350 * 10^6 req/day<br>
20 percent of 350 * 10^6 req/day * 500 bytes ~= 35 * 10^9 = 35 GB/day<br>

# Reference
1. https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82
2. https://dev.to/karanpratapsingh/system-design-url-shortener-10i5