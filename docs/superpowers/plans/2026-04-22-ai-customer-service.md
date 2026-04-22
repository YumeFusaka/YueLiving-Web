# AI Customer Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal owner-facing AI customer service flow that answers property-system questions using current user data and a Qwen-compatible backend API.

**Architecture:** The backend owns all model access and permission checks. It classifies each owner question, gathers only the current owner's relevant property-system data, builds a constrained prompt, calls the model through a small HTTP client, and returns a plain answer. The frontend adds one owner-only assistant page that posts a single message to the backend and renders the returned answer.

**Tech Stack:** Spring Boot 3, MyBatis-Plus, Java 17, JUnit 5, Vue 3, TypeScript, Element Plus, Axios

---

### Task 1: Define backend AI behavior with tests

**Files:**
- Create: `YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/service/AiServiceImplTest.java`
- Create: `YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/service/AiPromptBuilderTest.java`

- [ ] **Step 1: Write the failing tests**

```java
@Test
void shouldClassifyBillQuestions() {
    assertEquals(AiCategory.BILL, AiServiceImpl.classifyCategory("我有没有未缴费账单"));
}

@Test
void shouldRejectUnsupportedRole() {
    assertThrows(IllegalStateException.class, () -> service.chat("你好", 2L, "2"));
}

@Test
void shouldBuildPromptWithOwnerDataSummary() {
    String prompt = AiPromptBuilder.buildUserPrompt("我最近的报修进度", context);
    assertTrue(prompt.contains("最近报修"));
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `./mvnw.cmd -Dtest=AiServiceImplTest,AiPromptBuilderTest test`
Expected: FAIL because the AI classes do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```java
public enum AiCategory {
    PROPERTY, BILL, REPAIR, ANNOUNCEMENT, GENERAL
}

public static AiCategory classifyCategory(String message) {
    if (message.contains("账单") || message.contains("物业费") || message.contains("缴费")) {
        return AiCategory.BILL;
    }
    // remaining keyword checks...
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `./mvnw.cmd -Dtest=AiServiceImplTest,AiPromptBuilderTest test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/test/java/com/yumefusaka/yuelivingapi/service
git commit -m "test: define ai customer service behavior"
```

### Task 2: Implement backend AI module

**Files:**
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/AiController.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/AiService.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/AiServiceImpl.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/AiQueryService.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/AiQueryServiceImpl.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/QwenClient.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/QwenClientImpl.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/AiChatRequest.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/VO/AiChatResponse.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/VO/AiContext.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/VO/AiSummaryItem.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/common/ai/AiCategory.java`
- Create: `YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/common/ai/AiPromptBuilder.java`
- Modify: `YueLiving-Api/src/main/resources/application.yml`
- Modify: `YueLiving-Api/pom.xml`

- [ ] **Step 1: Implement request/response DTOs and category enum**

```java
@Data
public class AiChatRequest {
    private String message;
}

@Data
@AllArgsConstructor
public class AiChatResponse {
    private String category;
    private String answer;
}
```

- [ ] **Step 2: Implement AI query service using existing business services**

```java
AiContext buildContext(Long userId, AiCategory category) {
    List<Property> properties = propertyService.getPropertiesByOwnerId(userId);
    List<Bill> bills = billService.getBillsByUserId(userId);
    List<RepairOrder> repairs = repairOrderService.getRepairsByUserId(userId);
    List<Announcement> announcements = announcementService.listPublishedAnnouncements();
    return AiContext.from(category, properties, bills, repairs, announcements);
}
```

- [ ] **Step 3: Implement constrained prompt builder and Qwen client**

```java
String systemPrompt = """
你是物业系统业主端智能客服。
只能回答物业系统相关问题。
只能依据提供的数据作答，不得编造。
只允许回答当前登录业主自己的信息。
如果没有数据，请直接说明未查询到。
""";
```

- [ ] **Step 4: Implement AI service orchestration and controller**

```java
public AiChatResponse chat(String message, Long userId, String roleId) {
    if (!"1".equals(roleId)) {
        throw new IllegalStateException("仅业主可使用智能客服");
    }
    AiCategory category = classifyCategory(message);
    AiContext context = aiQueryService.buildContext(userId, category);
    String answer = qwenClient.chat(systemPrompt, AiPromptBuilder.buildUserPrompt(message, context));
    return new AiChatResponse(category.name(), answer);
}
```

- [ ] **Step 5: Run backend tests**

Run: `./mvnw.cmd -Dtest=AiServiceImplTest,AiPromptBuilderTest,YueLivingApiApplicationTests test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add pom.xml src/main/java src/main/resources/application.yml src/test/java
git commit -m "feat: add backend ai customer service"
```

### Task 3: Add frontend assistant page

**Files:**
- Create: `YueLiving-Web/src/apis/ai.ts`
- Create: `YueLiving-Web/src/views/AiAssistant.vue`
- Modify: `YueLiving-Web/src/router/index.ts`
- Modify: `YueLiving-Web/src/views/Home.vue`

- [ ] **Step 1: Add frontend API wrapper**

```ts
export type AiChatResponse = {
  category: string
  answer: string
}

export const chatWithAi = (message: string) =>
  instance.post<Data<AiChatResponse>>('/ai/chat', { message })
```

- [ ] **Step 2: Add owner-facing assistant page**

```ts
const submitQuestion = async () => {
  const res = await chatWithAi(question.value.trim())
  answer.value = res.data.data.answer
}
```

- [ ] **Step 3: Add route and owner menu entry**

```ts
{
  path: '/ai-assistant',
  name: 'AiAssistant',
  component: () => import('@/views/AiAssistant.vue'),
  meta: { requiresAuth: true, roles: [1] }
}
```

- [ ] **Step 4: Run frontend type-check**

Run: `pnpm type-check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/apis/ai.ts src/router/index.ts src/views/AiAssistant.vue src/views/Home.vue
git commit -m "feat: add owner ai assistant page"
```

### Task 4: Verify end-to-end integration

**Files:**
- Modify: `YueLiving-Api/src/main/resources/application.yml`

- [ ] **Step 1: Configure placeholder AI properties**

```yaml
ai:
  enabled: false
  provider: qwen
  base-url: https://dashscope.aliyuncs.com/compatible-mode/v1
  api-key: your-api-key
  model: qwen-plus
```

- [ ] **Step 2: Run backend verification**

Run: `./mvnw.cmd test`
Expected: PASS

- [ ] **Step 3: Run frontend verification**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/main/resources/application.yml
git commit -m "chore: verify ai customer service integration"
```
