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

# High Level Design and Future Work
## High Level Design
Overview will be inserted in here<br>
Possible hazard<br>
1. single point of failure web server / database

## Future Work
1. Load balancer and distributed server
2. Sharded database

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
5. Counter Approach
    counter를 담당하는 DB를 둔다.<br>
    한 번 받아올 때 뭉탱이로 받아와서 메모리에 저장해둔다.(메모리 접근 방지)<br>
    여러 counter를 사용하여 서버마다 1부터 1M, 1M부터 2M식으로 범위를 지정해서 counter를 리턴한다.<br>
    하나의 카운터가 모든 범위를 사용하면 문제가 생긴다.<br>
    하나의 카운터가 망가지면 그 서버는 작동이 불가능하다.<br>
    distributed service Zookeeper를 사용한다.(race condition, deadlock, or particle failure of data.)<br>
    Zookeeper는 distributed coordination service로 large set of hosts를 관리한다.(naming of the servers, active servers, dead servers, and configuration information of all the hosts)<br>
    여러 서버 사이에서 coordination과 synchronization을 관리한다.<br>
    동시에 같은 URL을 대상으로 와서 서로 다른 서버로 가서 다른 ID를 받을 가능성이 존재한다.<br>
    공간이 많으니 redundancy는 어느정도 용인 가능하다. 중요한건 서로 다른 URL에 대해 같은 ID를 받을 가능성이 없다는 점이다.<br>

# References
1. https://medium.com/@sandeep4.verma/system-design-scalable-url-shortener-service-like-tinyurl-106f30f23a82
2. https://dev.to/karanpratapsingh/system-design-url-shortener-10i5
3. https://www.mongodb.com/docs/manual/sharding/#sharding-strategy
4. https://www.geeksforgeeks.org/system-design-url-shortening-service/