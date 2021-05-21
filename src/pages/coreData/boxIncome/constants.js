export const lists = [
    [
      [
        {
          key: 'estimateBoxIncome',
          title: '中国大陆境内地区票房收入预测',
          remarks: '含服务费',
          money: 0,
          unit: '万',
        },
        {
          key: 'cumulateBox',
          title: '扣除：已产生票房',
          remarks: '含服务费',
          money: 0,
          unit: '万',
        },
        {
          key: 'futureBox',
          title: '未来票房空间',
          remarks: '计算公式：中国大陆境内地区票房收入预测-已产生票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'myGmv',
          title: '猫眼选座交易额',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '票务收入',
          remarks: '计算公式：猫眼选座交易额*猫眼票务收入占比',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'boxSplitIncome',
          title: '中国大陆境内地区未来分账票房空间',
          remarks: '计算公式：未来票房空间*（已产生分账票房/已产生累计票房)',
          money: 0,
          unit: '万',
        },
        {
          key: 'movieSpecialFunds',
          title: '扣除：国家电影专项基金',
          remarks: '5%票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'addedValueTax',
          title: '扣除：增值税税金及附加',
          remarks: '3.36%票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'pureBox',
          title: '净票房',
          remarks: '计算公式：中国大陆境内地区未来分账票房空间+扣除：国家电影专项基金+扣除：增值税税金及附加',
          money: 0,
          unit: '万',
        },
        {
          key: 'pianDueIncome',
          title: '片方应得收入',
          remarks: '43%净票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'myShareTransferIncome',
          title: '猫眼份额转让收入',
          remarks: '计算公式：猫眼份额转让收入*（1-影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'cfgcAgencyFee',
          title: '扣除：华夏/中影代理费',
          remarks: '默认1%的净票房，200万封顶',
          money: 0,
          unit: '万',
        },
        {
          key: 'advertisingCosts',
          title: '扣除：宣发费用',
          remarks: '片方应得收入*相应比例，计算公式为宣发费用*(1-影片已产生票房/票房收入预测)',
          money: 0,
          unit: '万',
        },
        {
          key: 'distributionAgencyFee',
          title: '扣除：发行代理费（除网络外）',
          remarks: '比例以合同为准，计算公式：发行代理费*（1-影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'creatorDividend',
          title: '扣除：主创分红',
          remarks: '比例以合同为准，计算公式：主创分红*（1-影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'productionCosts',
          title: '扣除：投资方成本',
          remarks: '比例以合同为准，计算公式：投资方成本*（1-影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'totalDeduct',
          title: '总扣除',
          remarks: '计算公式：上述5项扣除费用之和',
          money: 0,
          unit: '万',
        },
        {
          key: 'netIncome',
          title: '净收入',
          remarks: '计算公式：片方应得收入-总扣除',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '片方分账收入',
          remarks: '含回收成本，计算公式：净收入*猫眼份额+猫眼投资成本*（1-影片已产生票房/票房收入预测）+猫眼份额转让收入',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'myDistributionAgencyFee',
          title: '猫眼发行代理费',
          remarks: '以合同为准，计算公式为猫眼发行代理费*（1-影片已产生票房/票房收入预测)',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'ticketAllowanceIncome',
          title: '票补收入',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'platformResourceIncome',
          title: '平台资源收入',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'otherIncome',
          title: '其它收入',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'pianTicketAllowanceExpended',
          title: '扣除：已花费片方票补',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'platformResourceIncomeGot',
          title: '扣除：已获得资源收入',
          remarks: '计算公式：平台资源收入*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'otherIncomeGot',
          title: '扣除：已获得其它收入',
          remarks: '计算公式：其他资源收入*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '宣发收入',
          remarks: '计算公式：票补收入+平台资源收入+其它收入-扣除：已花片方票补-扣除：已获得资源收入-扣除：已获得其它收入',
          money: 0,
          unit: '万',
        },
      ]
    ],
    [
      [
        {
          key: 'estimateBoxIncome',
          title: '中国大陆境内地区票房收入预测',
          remarks: '含服务费',
          money: 0,
          unit: '万',
        },
        {
          key: 'cumulateBox',
          title: '已产生票房',
          remarks: '已产生票房, 含服务费',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '票务收入',
          remarks: '计算公式：猫眼选座交易额*猫眼票务收入占比',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'boxSplitIncome',
          title: '已产生的分账票房',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'movieSpecialFunds',
          title: '扣除：国家电影专项基金',
          remarks: '5%票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'addedValueTax',
          title: '扣除：增值税税金及附加',
          remarks: '3.36%票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'pureBox',
          title: '净票房',
          remarks: '计算公式：已产生的分账票房+扣除：国家电影专项基金+扣除：增值税税金及附加',
          money: 0,
          unit: '万',
        },
        {
          key: 'pianDueIncome',
          title: '片方应得收入',
          remarks: '43%净票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'myShareTransferIncome',
          title: '猫眼份额转让收入',
          remarks: '计算公式：猫眼份额转让收入*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'cfgcAgencyFee',
          title: '扣除：华夏/中影代理费',
          remarks: '默认1%的净票房，200万封顶',
          money: 0,
          unit: '万',
        },
        {
          key: 'advertisingCosts',
          title: '扣除：宣发费用',
          remarks: '片方应得收入*相应比例，计算公式为宣发费用*(影片已产生票房/票房收入预测)',
          money: 0,
          unit: '万',
        },
        {
          key: 'distributionAgencyFee',
          title: '扣除：发行代理费（除网络外）',
          remarks: '比例以合同为准，计算公式：发行代理费*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'creatorDividend',
          title: '扣除：主创分红',
          remarks: '比例以合同为准，计算公式：主创分红*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'productionCosts',
          title: '扣除：投资方成本',
          remarks: '比例以合同为准，计算公式：投资方成本*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'totalDeduct',
          title: '总扣除',
          remarks: '计算公式：上述5项扣除费用之和',
          money: 0,
          unit: '万',
        },
        {
          key: 'netIncome',
          title: '净收入',
          remarks: '计算公式：片方应得收入-总扣除',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '片方分账收入',
          remarks: '含回收成本，计算公式：净收入*猫眼份额+猫眼投资成本*（影片已产生票房/票房收入预测）+猫眼份额转让收入',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'myDistributionAgencyFee',
          title: '猫眼发行代理费',
          remarks: '以合同为准，计算公式为猫眼发行代理费*（影片已产生票房/票房收入预测)',
          money: 0,
          unit: '万',
        }
      ],
      [
        {
          key: 'pianTicketAllowanceExpended',
          title: '已花费片方票补',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'platformResourceIncomeGot',
          title: '已获得资源收入',
          remarks: '计算公式：平台资源收入*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'otherIncomeGot',
          title: '已获得其它收入',
          remarks: '计算公式：其它资源收入*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '宣发收入',
          remarks: '计算公式：已花片方票补+已获得资源收入+已获得其它收入',
          money: 0,
          unit: '万',
        },
      ]
    ],
    [
      [
        {
          key: 'estimateBoxIncome',
          title: '中国大陆境内地区票房收入预测',
          remarks: '含服务费',
          money: 0,
          unit: '万',
        },
        {
          key: 'cumulateBox',
          title: '已产生票房',
          remarks: '已产生票房, 含服务费',
          money: 0,
          unit: '万',
        },
        // {
        //   key: 'futureBox',
        //   title: '未来票房空间',
        //   remarks: '计算公式：中国大陆境内地区票房收入预测-已产生票房',
        //   money: 0,
        //   unit: '万',
        // },
        {
          key: 'myGmv',
          title: '猫眼选座交易额',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '票务收入',
          remarks: '计算公式：猫眼选座交易额*猫眼票务收入占比',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'boxSplitIncome',
          title: '总票房收入预测（不含服务费）',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'movieSpecialFunds',
          title: '扣除：国家电影专项基金',
          remarks: '5%票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'addedValueTax',
          title: '扣除：增值税税金及附加',
          remarks: '3.36%票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'pureBox',
          title: '净票房',
          remarks: '计算公式：总票房收入预测（不含服务费）+扣除：国家电影专项基金+扣除：增值税税金及附加',
          money: 0,
          unit: '万',
        },
        {
          key: 'pianDueIncome',
          title: '片方应得收入',
          remarks: '43%净票房',
          money: 0,
          unit: '万',
        },
        {
          key: 'myShareTransferIncome',
          title: '猫眼份额转让收入',
          remarks: '计算公式：猫眼份额转让收入*（影片已产生票房/票房收入预测）',
          money: 0,
          unit: '万',
        },
        {
          key: 'cfgcAgencyFee',
          title: '扣除：中影/华夏代理费',
          remarks: '默认1%的净票房，200万封顶',
          money: 0,
          unit: '万',
        },
        {
          key: 'advertisingCosts',
          title: '扣除：宣发费用',
          remarks: '片方应得收入*相应比例',
          money: 0,
          unit: '万',
        },
        {
          key: 'distributionAgencyFee',
          title: '扣除：发行代理费（除网络外）',
          remarks: '比例以合同为准',
          money: 0,
          unit: '万',
        },
        {
          key: 'creatorDividend',
          title: '扣除：主创分红',
          remarks: '比例以合同为准',
          money: 0,
          unit: '万',
        },
        {
          key: 'productionCosts',
          title: '扣除：投资方成本',
          remarks: '比例以合同为准',
          money: 0,
          unit: '万',
        },
        {
          key: 'totalDeduct',
          title: '总扣除',
          remarks: '计算公式：上述5项扣除费用之和',
          money: 0,
          unit: '万',
        },
        {
          key: 'netIncome',
          title: '净收入',
          remarks: '计算公式：片方应得收入-总扣除',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '片方分账收入',
          remarks: '含回收成本，计算公式：净收入*猫眼份额+猫眼投资成本+猫眼份额转让收入',
          money: 0,
          unit: '万',
        },
      ],
      [
        {
          key: 'myDistributionAgencyFee',
          title: '猫眼发行代理费',
          remarks: '以合同为准',
          money: 0,
          unit: '万',
        }
      ],
      [
        {
          key: 'ticketAllowanceIncome',
          title: '票补收入',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'platformResourceIncome',
          title: '平台资源收入',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'otherIncome',
          title: '其它收入',
          remarks: '',
          money: 0,
          unit: '万',
        },
        {
          key: 'total',
          title: '宣发收入',
          remarks: '计算公式：票补收入+平台资源收入+其它收入',
          money: 0,
          unit: '万',
        },
      ]
    ]
]

export const listsAfter = [
  [
    {
      key: 'estimateBoxIncome',
      title: '中国大陆境内地区票房收入',
      remarks: '含服务费',
      money: 0,
      unit: '万',
    },
    {
      key: 'myTicketIncomeRatio',
      title: '猫眼票务收入占比',
      remarks: '',
      money: 0,
      unit: '%',
    },
    {
      key: 'myGmv',
      title: '猫眼选座交易额',
      remarks: '',
      money: 0,
      unit: '万',
    },
    {
      key: 'total',
      title: '票务收入',
      remarks: '计算公式：猫眼选座交易额*猫眼票务收入占比',
      money: 0,
      unit: '万',
    },
  ],
  [
    {
      key: 'boxSplitIncome',
      title: '总票房收入',
      remarks: '不含服务费',
      money: 0,
      unit: '万',
    },
    {
      key: 'movieSpecialFunds',
      title: '扣除：国家电影专项基金',
      remarks: '5%票房',
      money: 0,
      unit: '万',
    },
    {
      key: 'addedValueTax',
      title: '扣除：增值税税金及附加',
      remarks: '3.36%票房',
      money: 0,
      unit: '万',
    },
    {
      key: 'pureBox',
      title: '净票房',
      remarks: '计算公式：总票房收入（不含服务费）+扣除：国家电影专项基金+扣除：增值税税金及附加',
      money: 0,
      unit: '万',
    },
    {
      key: 'pianDueIncome',
      title: '片方应得收入',
      remarks: '43%净票房',
      money: 0,
      unit: '万',
    },
    {
      key: 'myShareTransferIncome',
      title: '猫眼份额转让收入',
      remarks: '',
      money: 0,
      unit: '万',
    },
    {
      key: 'cfgcAgencyFee',
      title: '扣除：中影/华夏代理费',
      remarks: '默认1%的片方应得收入，200万封顶',
      money: 0,
      unit: '万',
    },
    {
      key: 'advertisingCosts',
      title: '扣除：宣发费用',
      remarks: '以合同为准',
      money: 0,
      unit: '万',
    },
    {
      key: 'distributionAgencyFee',
      title: '扣除：发行代理费（除网络外）',
      remarks: '以合同为准',
      money: 0,
      unit: '万',
    },
    {
      key: 'creatorDividend',
      title: '扣除：主创分红',
      remarks: '以合同为准',
      money: 0,
      unit: '万',
    },
    {
      key: 'productionCosts',
      title: '扣除：投资方成本',
      remarks: '以合同为准',
      money: 0,
      unit: '万',
    },
    {
      key: 'totalDeduct',
      title: '总扣除',
      remarks: '计算公式：上述5项扣除费用之和',
      money: 0,
      unit: '万',
    },
    {
      key: 'netIncome',
      title: '净收入',
      remarks: '计算公式：片方应得收入-总扣除',
      money: 0,
      unit: '万',
    },
    {
      key: 'total',
      title: '片方分账收入',
      remarks: '计算公式：净收入*猫眼份额+猫眼投资成本+猫眼份额转让收入',
      money: 0,
      unit: '万',
    },
  ],
  [
    {
      key: 'myDistributionAgencyFee',
      title: '猫眼发行代理费',
      remarks: '以合同为准',
      money: 0,
      unit: '万',
    },
  ],
  [
    {
      key: 'ticketAllowanceIncome',
      title: '票补收入',
      remarks: '',
      money: 0,
      unit: '万',
    },
    {
      key: 'platformResourceIncome',
      title: '平台资源收入',
      remarks: '',
      money: 0,
      unit: '万',
    },
    {
      key: 'otherIncome',
      title: '其它收入',
      remarks: '',
      money: 0,
      unit: '万',
    },
    {
      key: 'total',
      title: '宣发收入',
      remarks: '计算公式：票补收入+平台资源收入+其它收入',
      money: 0,
      unit: '万',
    },
  ]
]