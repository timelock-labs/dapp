# 创建新的timelock交易记录

创建新的timelock交易记录。前端发起交易后，需要提供chainid、timelock合约地址、timelock标准、txhash、txData、eta等信息。系统会验证用户权限（compound的admin，openzeppelin的proposer）后创建记录。

/api/v1/transaction/create  post

#### Parameters

```json
{
"chain_id": 0,
"chain_name": "string",
"description": "string",
"eta": 0,
"function_sig": "string",
"operation_id": "string",
"target": "string",
"timelock_address": "string",
"timelock_standard": "compound",
"tx_data": "string",
"tx_hash": "string",
"value": "string"
}
```

#### Responses

```json
{
"data": {
"can_cancel": true,
"can_execute": true,
"can_retry_submit": true,
"canceled_at": "string",
"chain_id": 0,
"chain_name": "string",
"created_at": "string",
"creator_address": "string",
"description": "string",
"eta": 0,
"executed_at": "string",
"function_sig": "string",
"id": 0,
"operation_id": "string",
"queued_at": "string",
"status": "submitting",
"status_message": "string",
"target": "string",
"time_remaining": 0,
"timelock_address": "string",
"timelock_standard": "compound",
"tx_data": "string",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
    ],
"value": "string"
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取当前用户的交易列表

获取当前用户的交易列表，支持按链ID、timelock地址、标准和状态进行筛选。返回带权限信息的交易列表，包括用户可执行和可取消的操作。

/api/v1/transaction/list

#### Parameters

- chain_id: integer
- timelock_address: string
- timelock_standard: compound / openzeppelin
- status: queued / ready / executed / expired / canceled
- page: integer *(必填)
- page_size: integer *(必填)

#### Responses

```json
{
"data": {
"page": 0,
"page_size": 0,
"total": 0,
"total_pages": 0,
"transactions": [
      {
"can_cancel": true,
"can_execute": true,
"can_retry_submit": true,
"canceled_at": "string",
"chain_id": 0,
"chain_name": "string",
"created_at": "string",
"creator_address": "string",
"description": "string",
"eta": 0,
"executed_at": "string",
"function_sig": "string",
"id": 0,
"operation_id": "string",
"queued_at": "string",
"status": "submitting",
"status_message": "string",
"target": "string",
"time_remaining": 0,
"timelock_address": "string",
"timelock_standard": "compound",
"tx_data": "string",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
        ],
"value": "string"
      }
    ]
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取待处理交易列表

获取状态为queued、ready、executing或failed的交易列表，可选择只显示当前用户可执行的交易。包含失败后可重试的交易。这是交易执行界面使用的主要接口，按ETA排序显示最紧急的交易。

/api/v1/transaction/pending

#### Parameters

- chain_id: integer
- only_can_exec: boolean
- page: integer *(必填)
- page_size: integer *(必填)

####  Responses

```json
{
"data": {
"page": 0,
"page_size": 0,
"total": 0,
"total_pages": 0,
"transactions": [
      {
"can_cancel": true,
"can_execute": true,
"can_retry_submit": true,
"canceled_at": "string",
"chain_id": 0,
"chain_name": "string",
"created_at": "string",
"creator_address": "string",
"description": "string",
"eta": 0,
"executed_at": "string",
"function_sig": "string",
"id": 0,
"operation_id": "string",
"queued_at": "string",
"status": "submitting",
"status_message": "string",
"target": "string",
"time_remaining": 0,
"timelock_address": "string",
"timelock_standard": "compound",
"tx_data": "string",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
        ],
"value": "string"
      }
    ]
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取交易统计信息

获取当前用户的交易统计信息，包括总交易数和各状态的交易数量。用于仪表板显示

/api/v1/transaction/stats

#### Responses

```json
{
"data": {
"canceled_count": 0,
"executed_count": 0,
"executing_count": 0,
"expired_count": 0,
"failed_count": 0,
"queued_count": 0,
"ready_count": 0,
"submit_failed_count": 0,
"submitting_count": 0,
"total_transactions": 0
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取指定交易的完整详细信息

获取指定交易的完整详细信息，包括交易数据、状态、权限信息以及关联的timelock合约信息。只有有权限的用户才能查看详细信息。

/api/v1/transaction/{id}

#### Parameters

- id: integer

#### Responses

```json
{
"data": {
"can_cancel": true,
"can_execute": true,
"can_retry_submit": true,
"canceled_at": "string",
"chain_id": 0,
"chain_name": "string",
"created_at": "string",
"creator_address": "string",
"description": "string",
"eta": 0,
"executed_at": "string",
"function_sig": "string",
"id": 0,
"operation_id": "string",
"queued_at": "string",
"status": "submitting",
"status_message": "string",
"target": "string",
"time_remaining": 0,
"timelock_address": "string",
"timelock_info": "string",
"timelock_standard": "compound",
"tx_data": "string",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
    ],
"value": "string"
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 取消timelock交易

取消处于queued或ready状态的timelock交易。需要验证用户权限（compound的admin，openzeppelin的canceller或创建者）。取消成功后更新交易状态。

/api/v1/transaction/{id}/cancel  post

#### Parameters

- id: integer

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 执行已就绪的timelock交易

执行已就绪的timelock交易或重试失败的交易。支持ready状态（ETA已到达）和failed状态（执行失败后重试）的交易。需要验证用户权限（compound的admin，openzeppelin的executor）。执行成功后更新交易状态。

/api/v1/transaction/{id}/execute post

#### Parameters

- id: integer

```json
{
"execute_tx_hash": "string",
"id": 0
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 标记交易执行失败

将执行中的交易标记为失败状态。这个接口通常由前端在区块链执行失败时调用，或者由后端监控程序调用。只能标记状态为executing的交易。

/api/v1/transaction/{id}/mark-failed post

#### Parameters

- id: integer

```json
{
"reason": "string",
"id": 0
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```




# 标记交易提交失败

将正在提交的交易标记为提交失败状态。这个接口通常由前端在提交到timelock合约失败时调用。只能标记状态为submitting的交易。

/api/v1/transaction/{id}/mark-submit-failed post

#### Parameters

- id: integer

```json
{
"reason": "string",
"id": 0
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```


# 重试提交交易

重试提交失败的交易。用于submit_failed状态的交易，允许用户使用新的交易哈希重新提交。需要验证用户权限（创建者或有提议权限的用户）。

/api/v1/transaction/{id}/retry-submit post

#### Parameters

- id: integer

```json
{
"tx_hash": "string",
"id": 0
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```
