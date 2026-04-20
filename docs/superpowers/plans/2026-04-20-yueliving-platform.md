# YueLiving Three-Role Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the owner, property-manager, and system-admin workflows for the single-community YueLiving platform without replacing the existing axios, JWT, router, or project scaffolding.

**Architecture:** Keep the current Vue 3 and Spring Boot skeletons, but rebuild the business layer around role-specific pages and scenario-oriented APIs. Expand the database schema incrementally, add missing domain models and management endpoints on the backend, then refit the frontend into a role-driven shell with dedicated owner, manager, and admin screens.

**Tech Stack:** Vue 3, Vite, TypeScript, Element Plus, Pinia, Vue Router, Spring Boot 3, MyBatis-Plus, MySQL, JWT, Maven

---

## File Structure Map

### Frontend

- Modify: `src/router/index.ts`
- Modify: `src/stores/modules/user.ts`
- Modify: `src/views/Home.vue`
- Modify: `src/views/Dashboard.vue`
- Modify: `src/views/Property.vue`
- Modify: `src/views/Bill.vue`
- Modify: `src/views/Repair.vue`
- Modify: `src/views/Announcement.vue`
- Modify: `src/views/Profile.vue`
- Modify: `src/views/User.vue`
- Modify: `src/views/Login.vue`
- Modify: `src/views/Register.vue`
- Modify: `src/apis/user.ts`
- Modify: `src/apis/property.ts`
- Modify: `src/apis/bill.ts`
- Modify: `src/apis/repair.ts`
- Modify: `src/apis/announcement.ts`
- Create: `src/apis/dashboard.ts`
- Create: `src/apis/config.ts`

### Backend

- Modify: `../YueLiving-Api/src/main/resources/schema.sql`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/LoginDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/UserStatusDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/BindOwnerDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/BillGenerateDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/RepairAssignDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/RepairProcessDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/AnnouncementPublishDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/SystemConfigDTO.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/User.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/Property.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/Bill.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/RepairOrder.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/Announcement.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/SystemConfig.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/OperationLog.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/RepairType.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/BillingRule.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/SystemConfigMapper.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/OperationLogMapper.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/RepairTypeMapper.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/BillingRuleMapper.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/UserService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/PropertyService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/BillService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/RepairOrderService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/AnnouncementService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/SystemConfigService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/OperationLogService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/RepairTypeService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/BillingRuleService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/UserServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/PropertyServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/BillServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/RepairOrderServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/AnnouncementServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/SystemConfigServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/OperationLogServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/RepairTypeServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/BillingRuleServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/UserController.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/PropertyController.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/BillController.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/RepairOrderController.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/AnnouncementController.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/DashboardController.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/SystemConfigController.java`
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`

### Task 1: Expand Schema And Domain Model

**Files:**
- Modify: `../YueLiving-Api/src/main/resources/schema.sql`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/User.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/Property.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/Bill.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/RepairOrder.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/Announcement.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/SystemConfig.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/OperationLog.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/RepairType.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity/BillingRule.java`
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`

- [ ] **Step 1: Write the failing schema smoke test**

```java
@Test
void schemaShouldContainNewBusinessTablesAndColumns() throws Exception {
    String schema = Files.readString(Path.of("src/main/resources/schema.sql"));

    assertTrue(schema.contains("CREATE TABLE system_config"));
    assertTrue(schema.contains("CREATE TABLE operation_log"));
    assertTrue(schema.contains("CREATE TABLE repair_type"));
    assertTrue(schema.contains("CREATE TABLE billing_rule"));
    assertTrue(schema.contains("last_login_time"));
    assertTrue(schema.contains("owner_id"));
    assertTrue(schema.contains("repair_type_id"));
}
```

- [ ] **Step 2: Run the schema smoke test and verify it fails**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#schemaShouldContainNewBusinessTablesAndColumns test`
Expected: `FAIL` because the new tables and columns are not in `schema.sql` yet.

- [ ] **Step 3: Add the schema and entity fields**

```sql
ALTER TABLE user ADD COLUMN last_login_time DATETIME NULL COMMENT '最近登录时间';
ALTER TABLE user ADD COLUMN remark VARCHAR(255) NULL COMMENT '备注';
ALTER TABLE property ADD COLUMN property_type VARCHAR(20) DEFAULT '住宅' COMMENT '房产类型';
ALTER TABLE property ADD COLUMN owner_name_snapshot VARCHAR(50) NULL COMMENT '业主姓名快照';
ALTER TABLE property ADD COLUMN bind_time DATETIME NULL COMMENT '绑定时间';
ALTER TABLE bill ADD COLUMN owner_id BIGINT NULL COMMENT '账单所属业主';
ALTER TABLE bill ADD COLUMN bill_item_name VARCHAR(100) NULL COMMENT '账单项目名称';
ALTER TABLE bill ADD COLUMN unit_price DECIMAL(10,2) NULL COMMENT '单价';
ALTER TABLE bill ADD COLUMN usage_amount DECIMAL(10,2) NULL COMMENT '用量';
ALTER TABLE bill ADD COLUMN generate_type VARCHAR(20) DEFAULT 'MANUAL' COMMENT '生成方式';
CREATE TABLE system_config (...);
CREATE TABLE operation_log (...);
CREATE TABLE repair_type (...);
CREATE TABLE billing_rule (...);
```

```java
@Data
@TableName("system_config")
public class SystemConfig {
    private Long id;
    private String configKey;
    private String configName;
    private String configValue;
    private String configType;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
```

- [ ] **Step 4: Re-run the schema smoke test and verify it passes**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#schemaShouldContainNewBusinessTablesAndColumns test`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/main/resources/schema.sql src/main/java/com/yumefusaka/yuelivingapi/pojo/Entity
git commit -m "feat: expand business schema for three-role platform"
```

### Task 2: Rebuild Auth And User Management APIs

**Files:**
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/LoginDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/UserStatusDTO.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/UserService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/UserServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/UserController.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/OperationLogService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/OperationLogServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/OperationLogMapper.java`
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`

- [ ] **Step 1: Write failing tests for login and role-specific user management**

```java
@Test
void loginShouldAcceptUsernameOrPhoneAndRejectDisabledUser() {
    assertTrue(userService.login("owner001", "123456") != null);
    assertTrue(userService.login("13800138000", "123456") != null);
    assertThrows(RuntimeException.class, () -> userService.ensureUserEnabled(disabledUser));
}

@Test
void systemAdminShouldManageManagersAndPropertyManagerShouldManageOwnersOnly() {
    assertTrue(userService.canManageUser(3L, 2L));
    assertTrue(userService.canManageUser(2L, 1L));
    assertFalse(userService.canManageUser(2L, 3L));
}
```

- [ ] **Step 2: Run the user management tests and verify they fail**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#loginShouldAcceptUsernameOrPhoneAndRejectDisabledUser,YueLivingApiApplicationTests#systemAdminShouldManageManagersAndPropertyManagerShouldManageOwnersOnly test`
Expected: `FAIL` because these methods and behaviors do not exist.

- [ ] **Step 3: Implement the minimal auth and user-management behavior**

```java
public User login(String account, String password) {
    LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
    wrapper.and(q -> q.eq(User::getUsername, account).or().eq(User::getPhone, account));
    User user = userMapper.selectOne(wrapper);
    if (user == null || !password.equals(user.getPassword())) {
        return null;
    }
    ensureUserEnabled(user);
    user.setLastLoginTime(LocalDateTime.now());
    userMapper.updateById(user);
    return user;
}

public boolean canManageUser(Long operatorRoleId, Long targetRoleId) {
    if (operatorRoleId.equals(RoleEnum.SYSTEM_ADMIN)) {
        return targetRoleId.equals(RoleEnum.PROPERTY_MANAGER);
    }
    return operatorRoleId.equals(RoleEnum.PROPERTY_MANAGER) && targetRoleId.equals(RoleEnum.OWNER);
}
```

```java
@PutMapping("/status")
public Result<String> updateUserStatus(@RequestBody UserStatusDTO dto) {
    userService.updateUserStatus(dto.getUserId(), dto.getStatus());
    return Result.success("状态更新成功");
}
```

- [ ] **Step 4: Re-run the user management tests and verify they pass**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#loginShouldAcceptUsernameOrPhoneAndRejectDisabledUser,YueLivingApiApplicationTests#systemAdminShouldManageManagersAndPropertyManagerShouldManageOwnersOnly test`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO src/main/java/com/yumefusaka/yuelivingapi/service src/main/java/com/yumefusaka/yuelivingapi/controller/UserController.java
git commit -m "feat: add role-aware auth and user management"
```

### Task 3: Implement Property Resource Management

**Files:**
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/BindOwnerDTO.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/PropertyService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/PropertyServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/PropertyController.java`
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`

- [ ] **Step 1: Write failing tests for owner binding and owner-only property queries**

```java
@Test
void propertyBindingShouldSetOwnerSnapshotAndBindTime() {
    propertyService.bindOwner(new BindOwnerDTO(1L, 8L));
    Property property = propertyService.getById(1L);
    assertEquals(8L, property.getOwnerId());
    assertNotNull(property.getOwnerNameSnapshot());
    assertNotNull(property.getBindTime());
}

@Test
void ownerPropertyQueryShouldOnlyReturnBoundProperties() {
    List<Property> properties = propertyService.getPropertiesByOwnerId(8L);
    assertTrue(properties.stream().allMatch(item -> item.getOwnerId().equals(8L)));
}
```

- [ ] **Step 2: Run the property tests and verify they fail**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#propertyBindingShouldSetOwnerSnapshotAndBindTime,YueLivingApiApplicationTests#ownerPropertyQueryShouldOnlyReturnBoundProperties test`
Expected: `FAIL`

- [ ] **Step 3: Implement property binding, unbinding, and filtered queries**

```java
public void bindOwner(BindOwnerDTO dto) {
    Property property = getById(dto.getPropertyId());
    User owner = userMapper.selectById(dto.getOwnerId());
    property.setOwnerId(owner.getId());
    property.setOwnerNameSnapshot(owner.getRealName());
    property.setBindTime(LocalDateTime.now());
    property.setStatus(1);
    updateById(property);
}
```

```java
@PutMapping("/bind-owner")
@RoleRequired({RoleEnum.PROPERTY_MANAGER, RoleEnum.SYSTEM_ADMIN})
public Result<String> bindOwner(@RequestBody BindOwnerDTO dto) {
    propertyService.bindOwner(dto);
    return Result.success("绑定成功");
}
```

- [ ] **Step 4: Re-run the property tests and verify they pass**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#propertyBindingShouldSetOwnerSnapshotAndBindTime,YueLivingApiApplicationTests#ownerPropertyQueryShouldOnlyReturnBoundProperties test`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/BindOwnerDTO.java src/main/java/com/yumefusaka/yuelivingapi/service/PropertyService.java src/main/java/com/yumefusaka/yuelivingapi/service/impl/PropertyServiceImpl.java src/main/java/com/yumefusaka/yuelivingapi/controller/PropertyController.java
git commit -m "feat: add property binding workflows"
```

### Task 4: Implement Bill Rules, Generation, Payment, And Statistics

**Files:**
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/BillGenerateDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/BillingRuleService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/BillingRuleServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/BillingRuleMapper.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/BillService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/BillServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/BillController.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/DashboardController.java`
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`

- [ ] **Step 1: Write failing tests for owner payment checks, bill generation, and dashboard stats**

```java
@Test
void ownerShouldOnlyPayOwnedBills() {
    assertThrows(RuntimeException.class, () -> billService.payBill(12L, 99L));
}

@Test
void monthlyPropertyFeeGenerationShouldCreateBillsForOccupiedProperties() {
    billService.generateBills(new BillGenerateDTO("PROPERTY_FEE", "2026-04", null));
    List<Bill> bills = billService.getBillsWithFilter(Map.of("period", "2026-04"));
    assertFalse(bills.isEmpty());
}

@Test
void dashboardSummaryShouldReturnUnpaidBillCounts() {
    Map<String, Object> summary = billService.buildManagerBillingSummary();
    assertTrue(summary.containsKey("unpaidBills"));
    assertTrue(summary.containsKey("paidRate"));
}
```

- [ ] **Step 2: Run the bill tests and verify they fail**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#ownerShouldOnlyPayOwnedBills,YueLivingApiApplicationTests#monthlyPropertyFeeGenerationShouldCreateBillsForOccupiedProperties,YueLivingApiApplicationTests#dashboardSummaryShouldReturnUnpaidBillCounts test`
Expected: `FAIL`

- [ ] **Step 3: Implement billing rules, generation, and secure payment**

```java
public void payBill(Long billId, Long currentUserId) {
    Bill bill = getById(billId);
    if (bill == null || !Objects.equals(bill.getOwnerId(), currentUserId)) {
        throw new RuntimeException("无权操作此账单");
    }
    bill.setStatus(1);
    bill.setPaidAmount(bill.getAmount());
    bill.setPayTime(LocalDateTime.now());
    updateById(bill);
}
```

```java
public void generateBills(BillGenerateDTO dto) {
    List<Property> properties = propertyMapper.selectList(new LambdaQueryWrapper<Property>()
        .isNotNull(Property::getOwnerId)
        .eq(Property::getStatus, 1));
    properties.forEach(property -> {
        Bill bill = new Bill();
        bill.setPropertyId(property.getId());
        bill.setOwnerId(property.getOwnerId());
        bill.setBillType(dto.getBillType());
        bill.setPeriod(dto.getPeriod());
        bill.setGenerateType("AUTO");
        save(bill);
    });
}
```

- [ ] **Step 4: Re-run the bill tests and verify they pass**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#ownerShouldOnlyPayOwnedBills,YueLivingApiApplicationTests#monthlyPropertyFeeGenerationShouldCreateBillsForOccupiedProperties,YueLivingApiApplicationTests#dashboardSummaryShouldReturnUnpaidBillCounts test`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/BillGenerateDTO.java src/main/java/com/yumefusaka/yuelivingapi/service src/main/java/com/yumefusaka/yuelivingapi/mapper/BillingRuleMapper.java src/main/java/com/yumefusaka/yuelivingapi/controller/BillController.java src/main/java/com/yumefusaka/yuelivingapi/controller/DashboardController.java
git commit -m "feat: add billing rules and dashboard bill stats"
```

### Task 5: Implement Repair, Announcement, Config, And Platform Stats APIs

**Files:**
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/RepairAssignDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/RepairProcessDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/AnnouncementPublishDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO/SystemConfigDTO.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/SystemConfigService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/RepairTypeService.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/SystemConfigServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/RepairTypeServiceImpl.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/SystemConfigMapper.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/mapper/RepairTypeMapper.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/RepairOrderService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/RepairOrderServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/AnnouncementService.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/service/impl/AnnouncementServiceImpl.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/RepairOrderController.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/AnnouncementController.java`
- Create: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/SystemConfigController.java`
- Modify: `../YueLiving-Api/src/main/java/com/yumefusaka/yuelivingapi/controller/DashboardController.java`
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`

- [ ] **Step 1: Write failing tests for repair flow, announcement publish flow, and config CRUD**

```java
@Test
void completedRepairShouldAcceptOwnerRatingOnlyFromOwner() {
    assertThrows(RuntimeException.class, () -> repairOrderService.rateRepair(3L, 99L, 5, "很好"));
}

@Test
void announcementDraftShouldNotAppearInOwnerList() {
    List<Announcement> announcements = announcementService.listPublishedForOwner();
    assertTrue(announcements.stream().noneMatch(item -> Objects.equals(item.getStatus(), "DRAFT")));
}

@Test
void systemConfigShouldPersistPropertyFeeDefaults() {
    systemConfigService.saveOrUpdateConfig(new SystemConfigDTO("PROPERTY_FEE_PRICE", "2.80"));
    assertEquals("2.80", systemConfigService.getByKey("PROPERTY_FEE_PRICE").getConfigValue());
}
```

- [ ] **Step 2: Run the repair, announcement, and config tests and verify they fail**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#completedRepairShouldAcceptOwnerRatingOnlyFromOwner,YueLivingApiApplicationTests#announcementDraftShouldNotAppearInOwnerList,YueLivingApiApplicationTests#systemConfigShouldPersistPropertyFeeDefaults test`
Expected: `FAIL`

- [ ] **Step 3: Implement workflow APIs and statistics aggregation**

```java
public void rateRepair(Long repairId, Long currentUserId, Integer rating, String comment) {
    RepairOrder repair = getById(repairId);
    if (!Objects.equals(repair.getUserId(), currentUserId) || repair.getStatus() != 3) {
        throw new RuntimeException("无权评价此工单");
    }
    repair.setRating(rating);
    repair.setComment(comment);
    updateById(repair);
}
```

```java
@GetMapping("/statistics/manager")
@RoleRequired({RoleEnum.PROPERTY_MANAGER})
public Result<Map<String, Object>> managerStatistics() {
    return Result.success(dashboardService.buildManagerStatistics());
}
```

```java
public List<Announcement> listPublishedForOwner() {
    return list(new LambdaQueryWrapper<Announcement>()
        .eq(Announcement::getStatus, "PUBLISHED")
        .orderByDesc(Announcement::getIsTop)
        .orderByDesc(Announcement::getPublishTime));
}
```

- [ ] **Step 4: Re-run the repair, announcement, and config tests and verify they pass**

Run: `./mvnw.cmd -Dtest=YueLivingApiApplicationTests#completedRepairShouldAcceptOwnerRatingOnlyFromOwner,YueLivingApiApplicationTests#announcementDraftShouldNotAppearInOwnerList,YueLivingApiApplicationTests#systemConfigShouldPersistPropertyFeeDefaults test`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/yumefusaka/yuelivingapi/pojo/DTO src/main/java/com/yumefusaka/yuelivingapi/service src/main/java/com/yumefusaka/yuelivingapi/mapper src/main/java/com/yumefusaka/yuelivingapi/controller
git commit -m "feat: add repair workflow, config management, and platform stats"
```

### Task 6: Refit Frontend Shell, User Store, And API Layers

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/stores/modules/user.ts`
- Modify: `src/views/Home.vue`
- Modify: `src/views/Login.vue`
- Modify: `src/views/Register.vue`
- Modify: `src/apis/user.ts`
- Modify: `src/apis/property.ts`
- Modify: `src/apis/bill.ts`
- Modify: `src/apis/repair.ts`
- Modify: `src/apis/announcement.ts`
- Create: `src/apis/dashboard.ts`
- Create: `src/apis/config.ts`

- [ ] **Step 1: Write the failing frontend type-check target by importing the new route and API surface**

```ts
export const getManagerStatistics = () => axios.get('/dashboard/statistics/manager')
export const getSystemOverview = () => axios.get('/dashboard/statistics/system')
export const updateUserStatus = (data: { userId: number; status: number }) =>
  axios.put('/user/status', data)
```

```ts
const roleHomeMap = {
  1: '/',
  2: '/',
  3: '/',
} as const
```

- [ ] **Step 2: Run frontend type-check and verify it fails**

Run: `pnpm type-check`
Expected: `FAIL` because the new API exports and role-based route logic do not exist everywhere yet.

- [ ] **Step 3: Implement the role-aware shell and shared API clients**

```ts
const menuByRole = {
  1: [
    { path: '/', label: '仪表板' },
    { path: '/property', label: '我的房产' },
    { path: '/bill', label: '费用中心' },
    { path: '/repair', label: '在线报修' },
    { path: '/announcement', label: '公告通知' },
    { path: '/profile', label: '个人中心' },
  ],
  2: [
    { path: '/', label: '仪表板' },
    { path: '/user', label: '业主管理' },
    { path: '/property', label: '房产资源' },
    { path: '/bill', label: '费用管理' },
    { path: '/repair', label: '报修工单' },
    { path: '/announcement', label: '公告管理' },
    { path: '/profile', label: '个人中心' },
  ],
}
```

```ts
const isPropertyManager = () => getRoleId() === 2
const isSystemAdmin = () => getRoleId() === 3
const isManagerSide = () => isPropertyManager() || isSystemAdmin()
```

- [ ] **Step 4: Re-run frontend type-check and verify it passes**

Run: `pnpm type-check`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/router/index.ts src/stores/modules/user.ts src/views/Home.vue src/views/Login.vue src/views/Register.vue src/apis
git commit -m "feat: add role-aware frontend shell and api clients"
```

### Task 7: Build Owner-Facing Screens

**Files:**
- Modify: `src/views/Dashboard.vue`
- Modify: `src/views/Property.vue`
- Modify: `src/views/Bill.vue`
- Modify: `src/views/Repair.vue`
- Modify: `src/views/Announcement.vue`
- Modify: `src/views/Profile.vue`

- [ ] **Step 1: Write the failing owner-screen contract by consuming the new backend fields**

```ts
type OwnerDashboardData = {
  propertyCount: number
  unpaidBillCount: number
  pendingRepairCount: number
  latestAnnouncements: Array<{ id: number; title: string }>
}
```

```vue
<el-table-column prop="ownerNameSnapshot" label="业主" />
<el-table-column prop="billItemName" label="账单项目" />
<el-table-column prop="processingResult" label="处理结果" />
```

- [ ] **Step 2: Run frontend type-check and verify it fails**

Run: `pnpm type-check`
Expected: `FAIL`

- [ ] **Step 3: Implement owner dashboard, property list, bill center, repair flow, announcements, and profile tabs**

```ts
onMounted(async () => {
  dashboard.value = await getOwnerDashboard()
  properties.value = await getMyProperties()
  bills.value = await getMyBills({ status: activeStatus.value })
})
```

```vue
<el-tabs v-model="activeTab">
  <el-tab-pane label="个人资料" name="info" />
  <el-tab-pane label="修改密码" name="password" />
  <el-tab-pane label="报修记录" name="repairs" />
  <el-tab-pane label="缴费历史" name="bills" />
</el-tabs>
```

- [ ] **Step 4: Re-run frontend type-check and verify it passes**

Run: `pnpm type-check`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/views/Dashboard.vue src/views/Property.vue src/views/Bill.vue src/views/Repair.vue src/views/Announcement.vue src/views/Profile.vue
git commit -m "feat: add owner portal workflows"
```

### Task 8: Build Property-Manager Screens

**Files:**
- Modify: `src/views/Dashboard.vue`
- Modify: `src/views/User.vue`
- Modify: `src/views/Property.vue`
- Modify: `src/views/Bill.vue`
- Modify: `src/views/Repair.vue`
- Modify: `src/views/Announcement.vue`
- Modify: `src/views/Profile.vue`

- [ ] **Step 1: Write the failing manager-screen contract for management actions**

```ts
type ManagerTodo = {
  pendingRepairs: number
  unpaidBills: number
  disabledOwners: number
}
```

```vue
<el-button type="primary" @click="openBindDialog(row)">绑定业主</el-button>
<el-button type="success" @click="generateMonthlyBills">生成账单</el-button>
<el-button type="warning" @click="acceptRepair(row)">受理</el-button>
```

- [ ] **Step 2: Run frontend type-check and verify it fails**

Run: `pnpm type-check`
Expected: `FAIL`

- [ ] **Step 3: Implement owner management, property binding, billing operations, repair dispatch, announcement publishing, and personal workbench**

```ts
const generateMonthlyBills = async () => {
  await generateBills({
    billType: 'PROPERTY_FEE',
    period: selectedPeriod.value,
    propertyIds: [],
  })
  await loadBills()
}
```

```ts
const acceptRepair = async (row: RepairRow) => {
  await processRepair({
    id: row.id,
    status: 1,
    processingResult: '',
  })
}
```

- [ ] **Step 4: Re-run frontend type-check and verify it passes**

Run: `pnpm type-check`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/views/Dashboard.vue src/views/User.vue src/views/Property.vue src/views/Bill.vue src/views/Repair.vue src/views/Announcement.vue src/views/Profile.vue
git commit -m "feat: add property manager workflows"
```

### Task 9: Build System-Admin Screens

**Files:**
- Modify: `src/views/Dashboard.vue`
- Modify: `src/views/User.vue`
- Modify: `src/views/Profile.vue`
- Modify: `src/views/Home.vue`
- Create: `src/apis/config.ts`

- [ ] **Step 1: Write the failing admin-screen contract for manager admin and config management**

```ts
type ConfigItem = {
  id: number
  configKey: string
  configName: string
  configValue: string
  configType: string
}
```

```vue
<el-button type="primary" @click="openManagerDialog()">新增物业管理员</el-button>
<el-button type="warning" @click="resetManagerPassword(row)">重置密码</el-button>
<el-button type="success" @click="openConfigDialog(row)">编辑配置</el-button>
```

- [ ] **Step 2: Run frontend type-check and verify it fails**

Run: `pnpm type-check`
Expected: `FAIL`

- [ ] **Step 3: Implement admin dashboard, manager management, config maintenance, and operation-log profile views**

```ts
const loadSystemOverview = async () => {
  overview.value = await getSystemOverview()
  configs.value = await getSystemConfigs()
  managers.value = await getManagerUsers()
}
```

```vue
<el-tab-pane label="系统配置" name="configs">
  <el-table :data="configs" />
</el-tab-pane>
<el-tab-pane label="操作记录" name="logs">
  <el-table :data="logs" />
</el-tab-pane>
```

- [ ] **Step 4: Re-run frontend type-check and verify it passes**

Run: `pnpm type-check`
Expected: `PASS`

- [ ] **Step 5: Commit**

```bash
git add src/views/Dashboard.vue src/views/User.vue src/views/Profile.vue src/views/Home.vue src/apis/config.ts
git commit -m "feat: add system admin portal workflows"
```

### Task 10: Full Verification And Regression Sweep

**Files:**
- Test: `../YueLiving-Api/src/test/java/com/yumefusaka/yuelivingapi/YueLivingApiApplicationTests.java`
- Test: `src/views/*.vue`
- Test: `src/apis/*.ts`

- [ ] **Step 1: Run the backend test suite**

Run: `./mvnw.cmd test`
Expected: `BUILD SUCCESS`

- [ ] **Step 2: Run frontend type-check**

Run: `pnpm type-check`
Expected: `PASS`

- [ ] **Step 3: Run frontend production build**

Run: `pnpm build`
Expected: `dist/` generated successfully without TypeScript or Vue compile errors

- [ ] **Step 4: Manual regression in the running dev app**

Run through:

```text
1. 登录业主账号，检查我的房产、费用中心、报修提单、公告列表、个人资料。
2. 登录物业管理员，检查业主管理、房产绑定、账单生成、工单处理、公告发布、统计看板。
3. 登录系统管理员，检查管理员管理、系统配置、总览看板、操作记录。
```

Expected: Each role sees only its own menus and can complete its main workflow.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: complete yueliving three-role platform"
```
