# 1. Project Description
Scalable한 URL shortener를 고민한다.<br>

## Estimation And Constraints
### Traffic
한 번 DB에 write된 URL은 공유되어 여러 번 read된다.<br>
read/write ratio를 100 : 1로 가정했다.<br>
1초에 만들어지는 unique한 shortened url의 개수: 40URLs/second<br>
1초에 redirect되는 URL의 개수: 4000URLs/second<br>

### Storage
총 필요한 메모리의 크기를 6TB라 가정한다.<br>

### Memory
Pareto Principle를 따르는 cache system을 구현한다.<br>
35GB의 in-memory cache가 필요하다.

## High Level Design And Future Work
### High Level Design
#### Ideal Architecture
Overview will be inserted in here<br>

#### Proposed Architecture In This Project
Overview will be inserted in here<br>
Ideal architecture에서 하나의 서버와 하나의 데이터베이스만을 시뮬레이션한다.<br>

##### Possible Hazard<br>
1. Server and DataBase can be a single point of failure

## Implementaition of Proposed Architecture
- [counter.js](./src/utils/counter.js)<br>
Unique key를 위하여 counter approach를 사용한다.<br>
SQL을 사용한다면 auto incrementation을 사용했겠지만, Scalability를 위하여 NoSQL을 선택했고 counter를 위한 collection을 따로 만들었다.<br>
counter는 한 번 접근할 때 하나의 큰 덩어리를 받아와서 write가 될 때마다 counter를 collection에서 받아오는 것을 방지한다.<br>
서버가 중지된다면 받아온 덩어리 중 사용하지 못 한 부분이 소실되지만 counter space가 커서 큰 문제가 되지 않는다.<br>

- [base62.js](./src/utils/base62.js)<br>
counter를 base62로 표기하여 shortened URL을 제공한다.<br>

- [simple_cache.js](./src/utils/simple_cache.js)<br>
저장된 URL이 변하지 않기에 요청된 URL을 cache하여 데이터베이스에 접근하는 latency를 줄일 수 있다.<br>
cache는 구현을 위해 단순한 LRU cache를 Map을 이용하여 구현하였다.<br>
데이터베이스에 엑세스하는 경우는 크게 두 가지로 나뉠 수 있다.<br>
    1. 입력된 URL에 대해 이미 shorten된 URL이 존재하는지 검색한다.<br>
    2. base62로 encoded된 counter로 original URL을 검색한다.<br>
    이 중에서 2.가 주요 bottleneck이 될거라고 생각하여 key as encoded count, value as URL을 가지는 캐시만을 구현하였다.<br>
    1.에 대한 구현은 memory와 latency의 trade off를 통해 결정할 수 있다.<br>










# Database
SQL Time Complexity<br>
O(n): full scan<br>
O(logn): binary search if it's sorted<br>
O(logn): indexed<br>
어쨋든 데이터의 양이 늘어나면 시간이 많이 소요됨<br>
id의 범위에 따라 테이블을 나누는 스케일링도 생각 가능하긴 하다.<br>

NoSQL Time Complexity<br>
기본적으로 full scan이 기본인데 search indexes로 줄일 수 있다.<br>
결국 O(logn)정도를 가질 거라고 예상된다.<br>

6TB를 저장하기 위해서는 분산된 데이터베이스가 필요할 것이다.<br>
table에 저장하면 분산된 table을 읽는 overhead가 필요하다.<br>
분산을 지원하는 NoSQL을 사용한다.<br>
MongoDB는 Hashed Sharding을 지원하여 shard key의 값에 따라 찾아야 할 chunk를 줄여준다. -> 더 빠른 read/write<br>
tiny URL as shard key<br>
ShortURL에 대해 search index를 만들 수도 있다.<br>


# References
1. https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82
2. https://dev.to/karanpratapsingh/system-design-url-shortener-10i5
3. https://www.mongodb.com/docs/manual/sharding/#sharding-strategy
4. https://www.geeksforgeeks.org/system-design-url-shortening-service/
