# Traffic and System Capacity
## Traffic
한 번 write된 URL은 공유되어 여러 번 read된다.
100 : 1 read/write ratio
달에 만들어지는 unique한 shortened url의 개수 = 100 * 10^6
1초에 만들어지는 unique한 shortened url의 개수 = (100 * 10^6) / (30일 * 24시간 * 60분 * 60초) ~= 40 URLs/second
1초에 redirect되는 url의 개수 = 40 URLs/second * 100 = 4000 URLs/second


# Reference
1. https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82