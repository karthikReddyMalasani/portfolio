'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import styles from './bank.module.css'

interface Account {
  id: string
  name: string
  type: 'Checking' | 'Savings' | 'Business'
  accountNumber: string
  balance: number
  createdAt: string
}

interface Transaction {
  id: string
  accountId: string
  type: 'credit' | 'debit'
  action: 'deposit' | 'withdraw' | 'transfer' | 'interest' | 'loan'
  amount: number
  description: string
  date: string
  accountNumber: string // Target or sender account
}

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Primary Checking',
    type: 'Checking',
    accountNumber: 'APEX-1284-5930',
    balance: 5420.00,
    createdAt: '2026-05-10',
  },
  {
    id: 'acc-2',
    name: 'Vault Savings',
    type: 'Savings',
    accountNumber: 'APEX-8294-1029',
    balance: 12850.00,
    createdAt: '2026-05-12',
  },
]

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    accountId: 'acc-1',
    type: 'credit',
    action: 'deposit',
    amount: 5000.00,
    description: 'Initial Deposit (Wire Transfer)',
    date: '2026-05-10',
    accountNumber: 'APEX-1284-5930',
  },
  {
    id: 'tx-2',
    accountId: 'acc-2',
    type: 'credit',
    action: 'deposit',
    amount: 12000.00,
    description: 'Savings Capital Stash',
    date: '2026-05-12',
    accountNumber: 'APEX-8294-1029',
  },
  {
    id: 'tx-3',
    accountId: 'acc-1',
    type: 'debit',
    action: 'withdraw',
    amount: 120.00,
    description: 'Apex Luxury Apparel Corp Debit',
    date: '2026-06-15',
    accountNumber: 'APEX-1284-5930',
  },
  {
    id: 'tx-4',
    accountId: 'acc-2',
    type: 'credit',
    action: 'interest',
    amount: 850.00,
    description: 'Vault Quarterly Yield Payoff',
    date: '2026-06-30',
    accountNumber: 'APEX-8294-1029',
  },
  {
    id: 'tx-5',
    accountId: 'acc-1',
    type: 'credit',
    action: 'deposit',
    amount: 540.00,
    description: 'Consulting Contract Payout',
    date: '2026-07-02',
    accountNumber: 'APEX-1284-5930',
  },
]

export default function BankManagement() {
  // --- States ---
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [isInitialised, setIsInitialised] = useState(false)

  // Form states
  const [txTab, setTxTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit')
  const [amountInput, setAmountInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [transferTarget, setTransferTarget] = useState('')
  const [transferTargetNo, setTransferTargetNo] = useState('')

  // Create Account states
  const [newAccName, setNewAccName] = useState('')
  const [newAccType, setNewAccType] = useState<'Checking' | 'Savings' | 'Business'>('Checking')

  // Notification alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all')

  // Calculator states
  const [fdPrincipal, setFdPrincipal] = useState(10000)
  const [fdRate, setFdRate] = useState(6.5)
  const [fdYears, setFdYears] = useState(5)

  const [loanIncome, setLoanIncome] = useState('')
  const [loanExistingEmi, setLoanExistingEmi] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTenure, setLoanTenure] = useState('5')
  const [loanSimResult, setLoanSimResult] = useState<{
    status: 'approved' | 'rejected'
    emi: number
    dti: number
    maxEligible: number
    reasons: string[]
  } | null>(null)

  // Tooltip for SVG chart
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ x: number; y: number; val: number; date: string } | null>(null)

  // Initialize data from LocalStorage
  useEffect(() => {
    const localAccs = localStorage.getItem('apex_bank_accounts')
    const localTxs = localStorage.getItem('apex_bank_transactions')

    if (localAccs && localTxs) {
      const parsedAccs = JSON.parse(localAccs) as Account[]
      const parsedTxs = JSON.parse(localTxs) as Transaction[]
      setAccounts(parsedAccs)
      setTransactions(parsedTxs)
      if (parsedAccs.length > 0) {
        setSelectedAccountId(parsedAccs[0].id)
      }
    } else {
      localStorage.setItem('apex_bank_accounts', JSON.stringify(DEFAULT_ACCOUNTS))
      localStorage.setItem('apex_bank_transactions', JSON.stringify(DEFAULT_TRANSACTIONS))
      setAccounts(DEFAULT_ACCOUNTS)
      setTransactions(DEFAULT_TRANSACTIONS)
      setSelectedAccountId(DEFAULT_ACCOUNTS[0].id)
    }
    setIsInitialised(true)
  }, [])

  // Sync to LocalStorage on state updates
  const saveState = (newAccs: Account[], newTxs: Transaction[]) => {
    localStorage.setItem('apex_bank_accounts', JSON.stringify(newAccs))
    localStorage.setItem('apex_bank_transactions', JSON.stringify(newTxs))
    setAccounts(newAccs)
    setTransactions(newTxs)
  }

  // --- Reset Application ---
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all account data? This will clear all transactions.')) {
      localStorage.removeItem('apex_bank_accounts')
      localStorage.removeItem('apex_bank_transactions')
      setAccounts(DEFAULT_ACCOUNTS)
      setTransactions(DEFAULT_TRANSACTIONS)
      setSelectedAccountId(DEFAULT_ACCOUNTS[0].id)
      setLoanSimResult(null)
      triggerAlert('success', 'Bank Management System reset to default demo values.')
    }
  }

  // --- Helper: trigger notification alert ---
  const triggerAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => {
      setAlert(null)
    }, 4500)
  }

  // --- Derived states ---
  const activeAccount = useMemo(() => {
    return accounts.find(a => a.id === selectedAccountId) || null
  }, [accounts, selectedAccountId])

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + curr.balance, 0)
  }, [accounts])

  // Aggregate monthly deposits & withdrawals for current active account
  const activeStats = useMemo(() => {
    if (!selectedAccountId) return { income: 0, expenses: 0 }
    const filetered = transactions.filter(t => t.accountId === selectedAccountId)
    const income = filetered
      .filter(t => t.type === 'credit')
      .reduce((sum, curr) => sum + curr.amount, 0)
    const expenses = filetered
      .filter(t => t.type === 'debit')
      .reduce((sum, curr) => sum + curr.amount, 0)
    return { income, expenses }
  }, [transactions, selectedAccountId])

  // Filtered transactions for active account based on search/type filter
  const filteredTransactions = useMemo(() => {
    if (!selectedAccountId) return []
    return transactions
      .filter(t => t.accountId === selectedAccountId)
      .filter(t => {
        if (filterType === 'all') return true
        return t.type === filterType
      })
      .filter(t => {
        if (!searchQuery) return true
        return t.description.toLowerCase().includes(searchQuery.toLowerCase())
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, selectedAccountId, filterType, searchQuery])

  // --- Action: Create Account ---
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAccName.trim()) {
      triggerAlert('error', 'Please enter an account name.')
      return
    }

    const typeCode = newAccType === 'Checking' ? '1' : newAccType === 'Savings' ? '8' : '5'
    const block1 = Math.floor(1000 + Math.random() * 9000)
    const block2 = Math.floor(1000 + Math.random() * 9000)
    const generatedNo = `APEX-${typeCode}${block1.toString().slice(1)}-${block2}`

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      name: newAccName.trim(),
      type: newAccType,
      accountNumber: generatedNo,
      balance: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    const newAccs = [...accounts, newAcc]
    const openTx: Transaction = {
      id: `tx-open-${Date.now()}`,
      accountId: newAcc.id,
      type: 'credit',
      action: 'deposit',
      amount: 0,
      description: `Account Opened (${newAcc.type})`,
      date: newAcc.createdAt,
      accountNumber: generatedNo,
    }
    const newTxs = [...transactions, openTx]

    saveState(newAccs, newTxs)
    setSelectedAccountId(newAcc.id)
    setNewAccName('')
    triggerAlert('success', `Successfully created your new ${newAcc.type} account!`)
  }

  // --- Action: Perform Transaction (Deposit / Withdraw / Transfer) ---
  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAccount) {
      triggerAlert('error', 'Select an active account first.')
      return
    }

    const amt = parseFloat(amountInput)
    if (isNaN(amt) || amt <= 0) {
      triggerAlert('error', 'Please enter a valid amount greater than $0.')
      return
    }

    const todayStr = new Date().toISOString().split('T')[0]

    // ── DEPOSIT ──
    if (txTab === 'deposit') {
      const desc = descInput.trim() || 'Manual Balance Deposit'
      const updatedAccs = accounts.map(a => {
        if (a.id === activeAccount.id) {
          return { ...a, balance: a.balance + amt }
        }
        return a
      })

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        accountId: activeAccount.id,
        type: 'credit',
        action: 'deposit',
        amount: amt,
        description: desc,
        date: todayStr,
        accountNumber: activeAccount.accountNumber,
      }

      saveState(updatedAccs, [...transactions, newTx])
      setAmountInput('')
      setDescInput('')
      triggerAlert('success', `Successfully deposited $${amt.toFixed(2)} to ${activeAccount.name}.`)
    }

    // ── WITHDRAW ──
    else if (txTab === 'withdraw') {
      if (activeAccount.balance < amt) {
        triggerAlert('error', 'Transaction declined: Insufficient funds.')
        return
      }

      const desc = descInput.trim() || 'Manual Balance Withdrawal'
      const updatedAccs = accounts.map(a => {
        if (a.id === activeAccount.id) {
          return { ...a, balance: a.balance - amt }
        }
        return a
      })

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        accountId: activeAccount.id,
        type: 'debit',
        action: 'withdraw',
        amount: amt,
        description: desc,
        date: todayStr,
        accountNumber: activeAccount.accountNumber,
      }

      saveState(updatedAccs, [...transactions, newTx])
      setAmountInput('')
      setDescInput('')
      triggerAlert('success', `Successfully withdrew $${amt.toFixed(2)} from ${activeAccount.name}.`)
    }

    // ── TRANSFER ──
    else if (txTab === 'transfer') {
      if (activeAccount.balance < amt) {
        triggerAlert('error', 'Transfer declined: Insufficient funds.')
        return
      }

      // Check if transferring to internal account
      if (transferTarget === 'internal') {
        const destAcc = accounts.find(a => a.id === transferTargetNo)
        if (!destAcc) {
          triggerAlert('error', 'Destination account not found.')
          return
        }
        if (destAcc.id === activeAccount.id) {
          triggerAlert('error', 'Source and target account cannot be the same.')
          return
        }

        const updatedAccs = accounts.map(a => {
          if (a.id === activeAccount.id) {
            return { ...a, balance: a.balance - amt }
          }
          if (a.id === destAcc.id) {
            return { ...a, balance: a.balance + amt }
          }
          return a
        })

        const debitTx: Transaction = {
          id: `tx-tr-deb-${Date.now()}`,
          accountId: activeAccount.id,
          type: 'debit',
          action: 'transfer',
          amount: amt,
          description: `Transfer to ${destAcc.name} (${destAcc.accountNumber})`,
          date: todayStr,
          accountNumber: destAcc.accountNumber,
        }

        const creditTx: Transaction = {
          id: `tx-tr-cred-${Date.now()}`,
          accountId: destAcc.id,
          type: 'credit',
          action: 'transfer',
          amount: amt,
          description: `Transfer from ${activeAccount.name} (${activeAccount.accountNumber})`,
          date: todayStr,
          accountNumber: activeAccount.accountNumber,
        }

        saveState(updatedAccs, [...transactions, debitTx, creditTx])
        setAmountInput('')
        setDescInput('')
        triggerAlert('success', `Successfully transferred $${amt.toFixed(2)} to ${destAcc.name}.`)
      }

      // External transfer
      else if (transferTarget === 'external') {
        if (!transferTargetNo.trim() || !transferTargetNo.startsWith('APEX-')) {
          triggerAlert('error', 'Please enter a valid ApexBank account number (starts with APEX-).')
          return
        }

        const updatedAccs = accounts.map(a => {
          if (a.id === activeAccount.id) {
            return { ...a, balance: a.balance - amt }
          }
          return a
        })

        const debitTx: Transaction = {
          id: `tx-tr-ext-${Date.now()}`,
          accountId: activeAccount.id,
          type: 'debit',
          action: 'transfer',
          amount: amt,
          description: `External Transfer to Account ${transferTargetNo}`,
          date: todayStr,
          accountNumber: transferTargetNo,
        }

        saveState(updatedAccs, [...transactions, debitTx])
        setAmountInput('')
        setDescInput('')
        setTransferTargetNo('')
        triggerAlert('success', `Successfully wired $${amt.toFixed(2)} to external account ${transferTargetNo}.`)
      }
    }
  }

  // --- Fixed Deposit Compound Yield Calculation ---
  const fdCalculation = useMemo(() => {
    // Formula: A = P * (1 + r/100)^t
    const maturityValue = fdPrincipal * Math.pow(1 + fdRate / 100, fdYears)
    const totalInterest = maturityValue - fdPrincipal
    return {
      maturityValue: Math.round(maturityValue * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      principalPercent: (fdPrincipal / maturityValue) * 100,
      interestPercent: (totalInterest / maturityValue) * 100,
    }
  }, [fdPrincipal, fdRate, fdYears])

  // --- Loan Eligibility logic ---
  const handleLoanSimulate = (e: React.FormEvent) => {
    e.preventDefault()

    const income = parseFloat(loanIncome)
    const existing = parseFloat(loanExistingEmi) || 0
    const amtRequested = parseFloat(loanAmount)
    const tenureY = parseInt(loanTenure)

    if (isNaN(income) || income <= 0 || isNaN(amtRequested) || amtRequested <= 0) {
      triggerAlert('error', 'Please input valid income and requested loan amounts.')
      return
    }

    // Assumptions:
    // Annual interest rate 9.25% p.a.
    const annualRate = 0.0925
    const monthlyRate = annualRate / 12
    const totalMonths = tenureY * 12

    // EMI calculation: [P * R * (1+R)^N] / [(1+R)^N - 1]
    const powFactor = Math.pow(1 + monthlyRate, totalMonths)
    const monthlyEMI = (amtRequested * monthlyRate * powFactor) / (powFactor - 1)

    // Guidelines:
    // 1. Debt-to-income (DTI) should not exceed 45% of income.
    const proposedEMICombined = existing + monthlyEMI
    const dtiRatio = (proposedEMICombined / income) * 100

    // 2. Max eligible loan amount is 60 times monthly income
    const maxLoanLimit = income * 60

    const reasons: string[] = []
    let status: 'approved' | 'rejected' = 'approved'

    if (dtiRatio > 45) {
      status = 'rejected'
      reasons.push(`Total EMIs ($${proposedEMICombined.toFixed(2)}) exceed 45% of monthly income (Current DTI: ${dtiRatio.toFixed(1)}%).`)
    }
    if (amtRequested > maxLoanLimit) {
      status = 'rejected'
      reasons.push(`Requested loan ($${amtRequested.toLocaleString()}) exceeds maximum capacity check ($${maxLoanLimit.toLocaleString()} limit based on income).`)
    }

    if (status === 'approved') {
      reasons.push('Excellent profile! DTI index falls within safe limits.')
      reasons.push('Requested loan principal is within maximum income multiple benchmarks.')
    }

    setLoanSimResult({
      status,
      emi: Math.round(monthlyEMI * 100) / 100,
      dti: Math.round(dtiRatio * 10),
      maxEligible: maxLoanLimit,
      reasons,
    })
  }

  // --- SVG Custom Trend Chart Generation ---
  // Calculates dynamic historical balances for selected account
  const chartPoints = useMemo(() => {
    if (!selectedAccountId || !activeAccount) return []
    // Get all transactions for active account sorted ascending
    const sorted = transactions
      .filter(t => t.accountId === selectedAccountId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // If no transactions, just return current balance point
    if (sorted.length === 0) {
      return [{ balance: activeAccount.balance, date: activeAccount.createdAt }]
    }

    // Walk backwards from current balance to build timeline
    let current = activeAccount.balance
    const historyList = [{ balance: current, date: new Date().toISOString().split('T')[0] }]

    // Reconstruct backwards
    for (let i = sorted.length - 1; i >= 0; i--) {
      const tx = sorted[i]
      if (tx.type === 'credit') {
        current -= tx.amount
      } else {
        current += tx.amount
      }
      historyList.unshift({ balance: current, date: tx.date })
    }

    // Limit to latest 7 timeline markers to avoid clutter
    if (historyList.length > 7) {
      return historyList.slice(-7)
    }
    return historyList
  }, [transactions, selectedAccountId, activeAccount])

  const svgPaths = useMemo(() => {
    if (chartPoints.length === 0) return { d: '', fill: '', nodes: [] }

    const width = 600
    const height = 180
    const padding = 20

    const balances = chartPoints.map(p => p.balance)
    const minVal = Math.min(...balances) * 0.9 // add 10% breathing room
    const maxVal = Math.max(...balances) * 1.1

    const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal
    const stepX = (width - padding * 2) / Math.max(1, chartPoints.length - 1)

    const points = chartPoints.map((p, idx) => {
      const x = padding + idx * stepX
      const ratio = (p.balance - minVal) / valRange
      const y = height - padding - ratio * (height - padding * 2)
      return { x, y, val: p.balance, date: p.date }
    })

    // Construct path string
    let pathD = ''
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x} ${points[i].y}`
      }
    }

    // Area fill path (draws down to the bottom gridline)
    let fillD = ''
    if (points.length > 0) {
      fillD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    }

    return { d: pathD, fill: fillD, nodes: points }
  }, [chartPoints])

  // Hydration safety check
  if (!isInitialised) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', opacity: 0.8 }}>
          <svg className={styles.logo} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 2s linear infinite' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Accessing Vault Database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Tooltip Overlay for SVG Chart */}
      {hoveredDataPoint && (
        <div
          className={styles.chartTooltip}
          style={{
            left: `${hoveredDataPoint.x}px`,
            top: `${hoveredDataPoint.y - 65}px`,
            opacity: 1,
            transform: 'translateX(-50%)',
          }}
        >
          <span className={styles.chartTooltipLabel}>{hoveredDataPoint.date}</span>
          <span className={styles.chartTooltipVal}>${hoveredDataPoint.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      )}

      {/* --- Header --- */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <svg className={styles.logo} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M12 2L3 7h18L12 2zM12 11v10M6 11v10M18 11v10" />
          </svg>
          <div>
            <h1 className={styles.title}>ApexBank</h1>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consolidated Vault Hub</p>
          </div>
        </div>
        <div className={styles.navActions}>
          <button id="resetSystemBtn" className={styles.resetBtn} onClick={handleReset} title="Clear all local data and reload defaults">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
            </svg>
            Reset App
          </button>
          <Link href="/" id="backToPortfolioBtn" className={styles.backBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </header>

      {/* --- Notification Banner --- */}
      {alert && (
        <div style={{ marginBottom: '2rem' }}>
          <div className={`${styles.alert} ${alert.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
            {alert.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* --- Overview Stats Grid --- */}
      <section className={styles.statsGrid}>
        <article className={`${styles.statCard} glass-card`}>
          <span className={styles.statLabel}>Net Portfolio Equity</span>
          <div className={styles.statVal}>${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <span className={styles.statSub}>Aggregated wealth across all accounts</span>
        </article>
        <article className={`${styles.statCard} glass-card`}>
          <span className={styles.statLabel}>Monthly Deposits Inflow</span>
          <div className={`${styles.statVal} ${styles.statValGreen}`}>+${activeStats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <span className={styles.statSub}>Total deposits into active account</span>
        </article>
        <article className={`${styles.statCard} glass-card`}>
          <span className={styles.statLabel}>Monthly Outflow Debit</span>
          <div className={`${styles.statVal} ${styles.statValRed}`}>-${activeStats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <span className={styles.statSub}>Total debits from active account</span>
        </article>
      </section>

      {/* --- Main Grid Layout --- */}
      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Account selector cards */}
          <section className={`${styles.sectionCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                Manage Vault Accounts
              </h2>
            </div>
            <div className={styles.accountsList}>
              {accounts.map(acc => (
                <div
                  key={acc.id}
                  id={`accountCard-${acc.id}`}
                  className={`${styles.accountCard} ${acc.id === selectedAccountId ? styles.accountCardActive : ''}`}
                  onClick={() => {
                    setSelectedAccountId(acc.id)
                    setHoveredDataPoint(null)
                  }}
                >
                  <div className={styles.accMeta}>
                    <span className={styles.accName}>{acc.name}</span>
                    <span className={styles.accType}>{acc.type}</span>
                  </div>
                  <span className={styles.accNo}>{acc.accountNumber}</span>
                  <div className={styles.accBal}>${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              ))}
            </div>

            {/* Create Account Form */}
            <form onSubmit={handleCreateAccount} className={styles.createForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="accountNameInput" className={styles.inputLabel}>New Vault Name</label>
                <input
                  id="accountNameInput"
                  type="text"
                  placeholder="e.g. Vacation Savings"
                  className={styles.inputField}
                  value={newAccName}
                  onChange={e => setNewAccName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="accountTypeSelect" className={styles.inputLabel}>Type</label>
                <select
                  id="accountTypeSelect"
                  className={styles.selectField}
                  value={newAccType}
                  onChange={e => setNewAccType(e.target.value as any)}
                >
                  <option value="Checking">Checking (1.2% APY)</option>
                  <option value="Savings">Savings (4.8% APY)</option>
                  <option value="Business">Business (2.5% APY)</option>
                </select>
              </div>
              <button type="submit" id="createAccountBtn" className={styles.btnAction}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Open Vault
              </button>
            </form>
          </section>

          {/* SVG Visual Chart */}
          <section className={`${styles.sectionCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
                Balance Timeline Trend
              </h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Latest transactions ledger history</span>
            </div>

            <div className={styles.chartWrapper}>
              <svg className={styles.chartSvg} viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  {/* Glowing line gradient */}
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00c875" />
                    <stop offset="100%" stopColor="#00F59B" />
                  </linearGradient>
                  {/* Under path area fill gradient */}
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F59B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00F59B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line className={styles.chartGridLine} x1="20" y1="20" x2="580" y2="20" />
                <line className={styles.chartGridLine} x1="20" y1="65" x2="580" y2="65" />
                <line className={styles.chartGridLine} x1="20" y1="110" x2="580" y2="110" />
                <line className={styles.chartGridLine} x1="20" y1="160" x2="580" y2="160" />

                {svgPaths.fill && <path className={styles.chartFill} d={svgPaths.fill} />}
                {svgPaths.d && <path className={styles.chartPath} d={svgPaths.d} />}

                {/* Nodes representing data markers */}
                {svgPaths.nodes.map((node, i) => (
                  <circle
                    key={i}
                    className={styles.chartDot}
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
                    onMouseEnter={() => setHoveredDataPoint(node)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  />
                ))}
              </svg>
            </div>
            <div className={styles.chartXAxis}>
              {chartPoints.map((p, idx) => (
                <span key={idx}>{p.date.slice(5)}</span>
              ))}
            </div>
          </section>

          {/* Interactive Calculator: Compound Interest */}
          <section className={`${styles.sectionCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Fixed Deposit Yield Calculator
              </h2>
            </div>
            <div className={styles.fdGrid}>
              {/* Sliders */}
              <div className={styles.fdControls}>
                <div className={styles.rangeGroup}>
                  <div className={styles.rangeHeader}>
                    <span>Principal Amount</span>
                    <span className={styles.rangeVal}>${fdPrincipal.toLocaleString()}</span>
                  </div>
                  <input
                    id="fdPrincipalInput"
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={fdPrincipal}
                    onChange={e => setFdPrincipal(parseInt(e.target.value))}
                    className={styles.sliderInput}
                  />
                </div>

                <div className={styles.rangeGroup}>
                  <div className={styles.rangeHeader}>
                    <span>Interest Rate</span>
                    <span className={styles.rangeVal}>{fdRate}% p.a.</span>
                  </div>
                  <input
                    id="fdRateInput"
                    type="range"
                    min="3.0"
                    max="12.0"
                    step="0.1"
                    value={fdRate}
                    onChange={e => setFdRate(parseFloat(e.target.value))}
                    className={styles.sliderInput}
                  />
                </div>

                <div className={styles.rangeGroup}>
                  <div className={styles.rangeHeader}>
                    <span>Tenure</span>
                    <span className={styles.rangeVal}>{fdYears} Years</span>
                  </div>
                  <input
                    id="fdYearsInput"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={fdYears}
                    onChange={e => setFdYears(parseInt(e.target.value))}
                    className={styles.sliderInput}
                  />
                </div>
              </div>

              {/* Yield Result Display with simple bar comparison */}
              <div className={styles.fdResult}>
                <div className={styles.chartContainer}>
                  <div className={styles.chartCol}>
                    <div
                      className={`${styles.chartBar} ${styles.barPrincipal}`}
                      style={{ height: `${fdCalculation.principalPercent}%` }}
                    />
                    <span className={styles.barLabel}>Principal</span>
                  </div>
                  <div className={styles.chartCol}>
                    <div
                      className={`${styles.chartBar} ${styles.barInterest}`}
                      style={{ height: `${fdCalculation.interestPercent}%` }}
                    />
                    <span className={styles.barLabel}>Interest</span>
                  </div>
                </div>

                <div className={styles.fdDetails}>
                  <div className={styles.fdDetailItem}>
                    <span className={styles.fdDetailLabel}>Maturity Value</span>
                    <span className={`${styles.fdDetailVal} ${styles.fdHighlight}`}>${fdCalculation.maturityValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={styles.fdDetailItem}>
                    <span className={styles.fdDetailLabel}>Interest Earned</span>
                    <span className={styles.fdDetailVal}>${fdCalculation.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Perform Transaction */}
          <section className={`${styles.sectionCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                Transact Funds
              </h2>
            </div>

            <div className={styles.tabs}>
              <button
                id="depositTabBtn"
                className={`${styles.tabBtn} ${txTab === 'deposit' ? styles.tabBtnActive : ''}`}
                onClick={() => { setTxTab('deposit'); setAmountInput(''); }}
              >
                Deposit
              </button>
              <button
                id="withdrawTabBtn"
                className={`${styles.tabBtn} ${txTab === 'withdraw' ? styles.tabBtnActive : ''}`}
                onClick={() => { setTxTab('withdraw'); setAmountInput(''); }}
              >
                Withdraw
              </button>
              <button
                id="transferTabBtn"
                className={`${styles.tabBtn} ${txTab === 'transfer' ? styles.tabBtnActive : ''}`}
                onClick={() => { setTxTab('transfer'); setAmountInput(''); }}
              >
                Send Money
              </button>
            </div>

            {activeAccount ? (
              <form onSubmit={handleTransaction} className={styles.txForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="txAmountInput" className={styles.inputLabel}>Amount ($)</label>
                  <input
                    id="txAmountInput"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className={styles.inputField}
                    value={amountInput}
                    onChange={e => setAmountInput(e.target.value)}
                    required
                  />
                </div>

                {txTab !== 'transfer' ? (
                  <div className={styles.inputGroup}>
                    <label htmlFor="txDescInput" className={styles.inputLabel}>Remarks / Description</label>
                    <input
                      id="txDescInput"
                      type="text"
                      placeholder="e.g. Grocery payment, paycheck"
                      className={styles.inputField}
                      value={descInput}
                      onChange={e => setDescInput(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div className={styles.inputGroup}>
                      <label htmlFor="transferTargetSelect" className={styles.inputLabel}>Destination Vault Type</label>
                      <select
                        id="transferTargetSelect"
                        className={styles.selectField}
                        value={transferTarget}
                        onChange={e => {
                          setTransferTarget(e.target.value)
                          setTransferTargetNo('')
                        }}
                        required
                      >
                        <option value="">-- Choose destination --</option>
                        <option value="internal">Own Internal Account</option>
                        <option value="external">External Apex Account</option>
                      </select>
                    </div>

                    {transferTarget === 'internal' && (
                      <div className={styles.inputGroup}>
                        <label htmlFor="transferTargetInternalSelect" className={styles.inputLabel}>Select Internal Account</label>
                        <select
                          id="transferTargetInternalSelect"
                          className={styles.selectField}
                          value={transferTargetNo}
                          onChange={e => setTransferTargetNo(e.target.value)}
                          required
                        >
                          <option value="">-- Select account --</option>
                          {accounts
                            .filter(a => a.id !== activeAccount.id)
                            .map(a => (
                              <option key={a.id} value={a.id}>
                                {a.name} ({a.accountNumber}) - ${a.balance.toFixed(2)}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {transferTarget === 'external' && (
                      <div className={styles.inputGroup}>
                        <label htmlFor="transferTargetExternalInput" className={styles.inputLabel}>Recipient Account Number</label>
                        <input
                          id="transferTargetExternalInput"
                          type="text"
                          placeholder="APEX-XXXX-XXXX"
                          className={styles.inputField}
                          value={transferTargetNo}
                          onChange={e => setTransferTargetNo(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                <button type="submit" id="submitTransactionBtn" className={styles.btnAction}>
                  Execute {txTab.charAt(0).toUpperCase() + txTab.slice(1)}
                </button>
              </form>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No accounts available to transact.</p>
            )}
          </section>

          {/* Transaction Ledger Log */}
          <section className={`${styles.sectionCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Ledger Logs
              </h2>
            </div>

            <div className={styles.ledgerHeader}>
              <div className={styles.searchBar}>
                <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  id="ledgerSearchInput"
                  type="text"
                  placeholder="Search ledger..."
                  className={`${styles.inputField} ${styles.searchInput}`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.filterGroup}>
                <button
                  id="filterAllBtn"
                  className={`${styles.filterBtn} ${filterType === 'all' ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilterType('all')}
                >
                  All
                </button>
                <button
                  id="filterCreditsBtn"
                  className={`${styles.filterBtn} ${filterType === 'credit' ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilterType('credit')}
                >
                  Credits
                </button>
                <button
                  id="filterDebitsBtn"
                  className={`${styles.filterBtn} ${filterType === 'debit' ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilterType('debit')}
                >
                  Debits
                </button>
              </div>
            </div>

            <div className={styles.ledgerScroll}>
              {filteredTransactions.length > 0 ? (
                <div className={styles.ledgerList}>
                  {filteredTransactions.map(tx => (
                    <div key={tx.id} className={styles.ledgerItem}>
                      <div className={styles.txMeta}>
                        <span className={styles.txDesc}>{tx.description}</span>
                        <div className={styles.txSub}>
                          <span className={styles.txDate}>{tx.date}</span>
                          <span>•</span>
                          <span className={styles.txAccNo}>{tx.accountNumber}</span>
                        </div>
                      </div>
                      <span className={`${styles.txAmount} ${tx.type === 'credit' ? styles.txCredit : styles.txDebit}`}>
                        {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyLedger}>
                  <span>No recorded history markers match search.</span>
                </div>
              )}
            </div>
          </section>

          {/* Interactive Calculator: Loan Eligibility Checker */}
          <section className={`${styles.sectionCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                ApexCredit Loan Eligibility Simulator
              </h2>
            </div>

            <form onSubmit={handleLoanSimulate} className={styles.loanForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="loanIncomeInput" className={styles.inputLabel}>Monthly Net Income ($)</label>
                <input
                  id="loanIncomeInput"
                  type="number"
                  placeholder="e.g. 6500"
                  className={styles.inputField}
                  value={loanIncome}
                  onChange={e => setLoanIncome(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanExistingEmiInput" className={styles.inputLabel}>Existing Monthly EMIs ($)</label>
                <input
                  id="loanExistingEmiInput"
                  type="number"
                  placeholder="e.g. 350"
                  className={styles.inputField}
                  value={loanExistingEmi}
                  onChange={e => setLoanExistingEmi(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanAmountInput" className={styles.inputLabel}>Requested Loan Principal ($)</label>
                <input
                  id="loanAmountInput"
                  type="number"
                  placeholder="e.g. 50000"
                  className={styles.inputField}
                  value={loanAmount}
                  onChange={e => setLoanAmount(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTenureSelect" className={styles.inputLabel}>Tenure</label>
                <select
                  id="loanTenureSelect"
                  className={styles.selectField}
                  value={loanTenure}
                  onChange={e => setLoanTenure(e.target.value)}
                  required
                >
                  <option value="3">3 Years (9.25% APR)</option>
                  <option value="5">5 Years (9.25% APR)</option>
                  <option value="7">7 Years (9.25% APR)</option>
                  <option value="10">10 Years (9.25% APR)</option>
                </select>
              </div>

              <button type="submit" id="loanCheckBtn" className={styles.btnAction} style={{ gridColumn: 'span 2' }}>
                Analyze Profile Eligibility
              </button>
            </form>

            {loanSimResult && (
              <div
                className={`${styles.loanResult} ${
                  loanSimResult.status === 'approved' ? styles.loanApproved : styles.loanRejected
                }`}
              >
                <h3 className={styles.loanResultTitle}>
                  {loanSimResult.status === 'approved' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      ApexCredit Profile Approved
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      ApexCredit Profile Declined
                    </>
                  )}
                </h3>
                <p className={styles.loanResultDesc}>
                  {loanSimResult.status === 'approved'
                    ? 'Based on your simulated metrics, your application meets credit risk management benchmarks.'
                    : 'The analysis identified indicators that exceed standard risk limits.'}
                </p>

                <ul style={{ margin: '0.5rem 0 0.75rem 1.2rem', padding: 0, fontSize: '0.72rem', lineHeight: '1.4' }}>
                  {loanSimResult.reasons.map((r, i) => (
                    <li key={i} style={{ marginBottom: '0.15rem' }}>{r}</li>
                  ))}
                </ul>

                <div className={styles.loanCalculations}>
                  <div className={styles.loanCalcItem}>
                    <span className={styles.loanCalcLabel}>Monthly EMI Yield</span>
                    <span className={styles.loanCalcVal}>${loanSimResult.emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={styles.loanCalcItem}>
                    <span className={styles.loanCalcLabel}>Aggregate DTI Score</span>
                    <span className={styles.loanCalcVal}>{loanSimResult.dti}%</span>
                  </div>
                  <div className={styles.loanCalcItem}>
                    <span className={styles.loanCalcLabel}>Credit Limit Max Cap</span>
                    <span className={styles.loanCalcVal}>${loanSimResult.maxEligible.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
