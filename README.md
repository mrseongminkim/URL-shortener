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
1. single point of failure web server / database

### Future Work
1. Load balancer and distributed server
2. Sharded database

## Implementaition of Proposed Architecture
### Shortening Algorithm
Unique key를 위하여 counter approach를 사용한다.<br>
SQL을 사용한다면 auto incrementation을 사용했겠지만, Scalability를 위하여 NoSQL을 선택했고 counter를 위한 collection을 따로 만들었다.
counter는 한 번 접근할 때 하나의 큰 덩어리를 받아와서 write가 될 때마다 counter를 collection에서 받아오는 것을 방지한다.
서버가 중지된다면 받아온 덩어리 중 사용하지 못 한 부분이 소실되지만 counter space가 커서 큰 문제가 되지 않는다.
기본적으로 counter space가 크기에 redundancy는 용인 된다.
[counter.js](./src/utils/counter.js)









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


# Shortening Algorithm
1. random number
    랜덤하게 7자리로 base62로 만들고 그걸 unique key로 사용<br>
    key가 이미 존재하는지 확인해야하며 데이터베이스가 커지면서 점점 비효율적이된다.<br>
    새로운 URL이 왔을때 이게 이미 있는 것인지 full scan을 해야한다는 단점도 있다.<br>
2. using counter
    counter를 사용할 때마다 증가한다.<br>
    SQL을 사용하면 바로 적용 가능할텐데 scalability때문에 적용이 힘들 것 같다. auto increment<br>
    새로운 URL이 왔을때 이게 이미 있는 것인지 full scan을 해야한다는 단점도 있다.<br>
3. MD5 hash
    URL 자체를 encode하고 나온 128 bit를 사용한다.<br>
    32개의 16진수가 생성된다.<br>
    이 중에 첫 7글자를 사용하고 겹친다면 다음 7글자를 사용한다.<br>
    이 값을 단순하게 key로 사용하기도 어려운게 어떤 인덱스에 있는 글자들을 사용했는지 알 수 없다.<br>
4. Key Generation Service(KGS)
    key-DB에 미리 랜덤한 키들을 만들어 둔다.<br>
    미리 만들어진 키를 가져와서 사용한다.<br>
    중복 걱정 없고 미리 만들어두기에 빠르다.<br>
    concurrency: 여러 서버가 같은 키에 접근한다면 문제가 생긴다.<br>
    unused, used로 table을 나누고 서버에 의해서 key가 읽히면 table을 옮긴다.<br>
    KGS는 메모리 상에 key들을 조금 저장해 서버가 필요할 때 빨리 전달 가능하며 Memory에 옮길 때 used라고 체크해서 unique를 보장한다.<br>
    KGS는 SQL로 lock 및 sync 기능을 쓰기에 좋아보인다.<br>
    KGS can be a SPOF<br>


# References
1. https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82
2. https://dev.to/karanpratapsingh/system-design-url-shortener-10i5
3. https://www.mongodb.com/docs/manual/sharding/#sharding-strategy
4. https://www.geeksforgeeks.org/system-design-url-shortening-service/
