export const REALTIME_DATA_LISTS = [
    [
      {
        title: '宣发费用',
        money: '',
        dataIndex: 'advertisingCosts',
        unit: '万',
      },
      {
        title: '总发行代理费',
        remarks: '以合同为准，一般为片方应得收入的15%或净票房的5%',
        money: '',
        dataIndex: 'distributionAgencyFee',
        toCalculate: '去计算',
        unit: '万',
      },
      {
        title: '猫眼发行代理费',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: '',
        dataIndex: 'myDistributionAgencyFee',
        unit: '万',
      },
      {
        title: '主创分红',
        remarks: '以合同为准',
        toCalculate: '去计算',
        money: '',
        dataIndex: 'creatorDividend',
        unit: '万',
      },
      {
        title: '猫眼投资成本',
        remarks: '',
        money: '',
        dataIndex: 'myInvestment',
        unit: '万',
      },
      {
        title: '投资方成本',
        remarks: '以合同为准',
        money: '',
        dataIndex: 'productionCosts',
        unit: '万',
      },
      {
        title: '猫眼份额',
        remarks: '',
        money: '',
        dataIndex: 'myShare',
        unit: '%',
      },
      {
        title: '猫眼份额转让收入',
        remarks: '',
        money: '',
        dataIndex: 'myShareTransferIncome',
        unit: '万',
      },
      {
        title: '宣发费用中猫眼票补收入（含税）',
        remarks: '',
        money: '',
        dataIndex: 'ticketAllowanceIncome',
        unit: '万',
      },
      {
        title: '宣发费用中猫眼平台资源收入',
        remarks: '',
        money: '',
        dataIndex: 'platformResourceIncome',
        unit: '万',
      },
      {
        title: '其它收入',
        remarks: '',
        money: '',
        dataIndex: 'otherIncome',
        unit: '万',
      },
    ],
    [
      {
        title: '中国大陆境内地区票房收入预测(元)',
        remarks: '机器预测，含服务费',
        dataIndex: 'estimateBoxIncome',
        unit: '',
      },
      {
        title: '已产生票房',
        remarks: '含服务费',
        dataIndex: 'cumulateBox',
        unit: '',
      },
      {
        title: '未来票房空间',
        remarks: '中国大陆境内地区票房收入预测扣除已产生票房',
        dataIndex: 'futureBox',
        unit: '',
      },
      {
        title: '中国大陆境内地区未来分账票房空间',
        remarks: '未来票房空间*（已产生分账票房/已产生累计票房）',
        dataIndex: 'futureBoxSplitIncome',
        unit: '',
      },
      {
        title: '净票房',
        remarks: '中国大陆境内地区未来分账票房空间扣除国家电影专项基金和增值税税金及附加',
        dataIndex: 'pureBox',
        unit: '',
      },
      {
        title: '猫眼选座交易额占比',
        remarks: '计算公式：实时猫眼选座交易额/已产生的票房',
        dataIndex:'myGmvRatio',
        unit: '%',
      },
      {
        title: '猫眼票务收入占比',
        remarks: '计算公式：实时已产生的票务收入/实时猫眼选座交易额',
        dataIndex: 'myTicketIncomeRatio',
        unit: '%',
      },
      {
        title: '宣发费用中已花费片方票补（含税）',
        remarks: '',
        dataIndex: 'pianTicketAllowanceExpended',
        unit: '',
      },
      {
        title: '宣发费用中猫眼平台已获得的资源收入',
        remarks: '计算公式：(已产生票房/票房收入预测)*宣发费用中猫眼平台资源收入',
        dataIndex: 'platformResourceIncomeGot',
        unit: '',
      },
      {
        title: '宣发费用中猫眼平台已获得的其它收入',
        remarks: '计算公式：(已产生票房/票房收入预测)*其它收入',
        dataIndex: 'otherIncomeGot',
        unit: '',
      }
    ],
    [
      {
        title: '国家电影专项基金',
        remarks: '默认5%的票房',
        dataIndex: 'movieSpecialFunds',
        unit: '%',
      },
      {
        title: '增值税税金及附加',
        remarks: '默认3.36%的票房',
        dataIndex: 'addedValueTax',
        unit: '%',
      },
      {
        title: '中影华夏代理费/净票房',
        remarks: '默认1%的净票房，200万元封顶',
        dataIndex: 'cfgcAgencyFeeDividePianDueIncome',
        unit: '%',
      },
      {
        title: '片方应得收入/净票房',
        remarks: '默认43%',
        dataIndex: 'pianDueIncomeDividePureBox',
        unit: '%',
      },
    ]
];