# javascript-convenience-store-precourse

# 1. 프로그램 소개 - 편의점

이 편의점 관리 프로그램은 사용자가 상품을 선택하고 결제할 수 있는 간단한 편의점 시뮬레이션입니다. 이 프로그램은 편의점의 상품 목록과 재고를 관리하며, 다양한 할인 및 프로모션 정책을 적용해 최종 결제 금액을 산출합니다. 또한 멤버십 할인과 추가 구매 옵션을 제공하여, 사용자에게 현실적인 구매 경험을 제공합니다.

# 2. 기능 목록

### InputView (views/)

- 구매할 상품명과 수량 입력 받기
- 추가 수량 입력 선택 (Y/N) 받기
- 멤버십 할인 적용 여부 입력 받기
- 추가 구매 여부 입력 받기

### OutputView (views/)

- 현재 상품 목록과 프로모션 정보 출력
- 구매 내역, 할인 내역, 최종 결제 금액이 포함된 영수증 출력
- 오류 발생 시 적절한 메시지 출력

### ProductManager (models/)

- ✅ 초기 상품 목록 필드에 세팅
- ✅ 구매하려는 상품의 재고가 충분한지 확인
- 구매 후 재고 차감
- 프로모션 재고에서 차감

### Cart (models/)

- 장바구니에 상품과 수량 추가
- 상품별 가격과 수량을 바탕으로 총 구매액 계산
- 프로모션과 멤버십 할인을 적용해 최종 금액 계산

### PromotionManager (models/)

- 프로모션 적용 가능 여부 확인
- N+1 프로모션(예: 1+1, 2+1) 혜택 적용
- 프로모션에 따른 할인 금액 계산

### MembershipManager (models/)

- 멤버십 회원 할인 적용 (최대 8,000원까지)

### loadProductData() (utils/)

- ✅ 초기 상품 목록 객체 데이터로 가져오기

# 3. 회고

#### 지원서나 중간 회고에서 현실적인 목표를 설정하고 이를 달성했다고 생각하나요? 그 이유는 무엇인가요?

#### 중간 회고에서 조정한 목표가 실제 목표 달성에 도움이 되었나요? 목표를 달성하는 데 어떤 점이 효과적이었다고 생각하나요?

#### 각 미션의 목표를 달성하기 위해 세운 계획을 잘 이행했나요? 그 과정에서 어떤 전략이 효과가 있었나요?

#### 몰입하고 함께 성장하는 과정을 통해 인상 깊었던 경험이나 변화가 있었나요?
