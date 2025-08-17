![Skej Logo](assets/assets/logo-skej.png)

# Skej - "Send me your skej" - Privacy-first ENS calendar scheduling infra on Zirkuit for the AI Agent Economy


## 🏆 Competition Submission
Note: The epics and app code are from an alternative implementation idea (:. Ignore.

**One-sentence description:** Skej is a decentralized scheduling protocol that enables privacy-preserving meeting coordination between ENS addresses using ZK proofs on Zircuit, with token payments for premium scheduling features and AI agent services.

**Why we should win:** Skej solves the trillion-dollar scheduling coordination problem with Web3 principles while creating a first privacy-first scheduling infrastructure specifically designed for the emerging AI agent and creator economy - leveraging all of Zircuit's unique capabilities like speed, low costs and Ethereum securities.

---

## Problem Statement

### The Current Scheduling Crisis
- **$541 billion lost annually** due to poor meeting coordination and scheduling inefficiencies
- **Centralized scheduling platforms** (Calendly, Doodle) own your data and limit interoperability
- **Privacy violations**: Current solutions expose entire calendar contents to coordinate single meetings
- **AI agents increasingly need scheduling** but lack decentralized, cost-effective coordination mechanisms
- **Web3 identity systems** (ENS) have no native scheduling layer, forcing users back to Web2 tools

### Specific Pain Points
1. **Privacy Paradox**: To find mutual availability, both parties must expose slots in their calendars
2. **Platform Lock-in**: Scheduling data trapped in centralized silos
3. **AI Agent Barriers**: High gas costs and centralized APIs prevent autonomous agent scheduling
4. **Identity Fragmentation**: ENS identities can't directly coordinate scheduling
5. **No Value Exchange**: Current systems don't enable paid/premium scheduling services

---

## Solution: Skej Protocol

### Core Innovation
Skej creates a **privacy-first scheduling layer** for ENS addresses using Zircuit's ZK rollup capabilities, enabling:
- **Zero-knowledge availability matching** without revealing full calendars
- **Decentralized coordination** through blockchain events and IPFS
- **Zircuit (ZRC) token payments** for premium scheduling features
- **AI agent optimization** with low-cost, high-frequency interactions

### Leveraging Zircuit's Unique Capabilities

#### 1. Sequencer Level Security
- **AI-enabled fraud detection** prevents scheduling spam and manipulation
- **Enhanced security** for high-value business meetings and contracts
- **Trust minimization** for autonomous agent interactions

#### 2. Account Abstraction Support
- **Gasless scheduling** for end users (sponsors pay gas in ZRC tokens)
- **Batch operations** for AI agents managing multiple calendars
- **Smart wallet integration** for seamless UX

#### 3. Network Performance
- **Sub-second scheduling** confirmation vs. minutes on Ethereum L1
- **Cost efficiency**: $0.01 vs $50+ per scheduling interaction
- **High throughput** supporting enterprise-scale scheduling coordination

---

## Functional Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ENS Identity  │    │  IPFS Storage   │    │ Zircuit L2      │
│                 │    │                 │    │                 │
│ alice.eth       │───▶│ Calendar Feeds  │◄───│ Scheduling      │
│ bob.eth         │    │ Availability    │    │ Contracts       │
│ ai-agent.eth    │    │ Encrypted Data  │    │ ZK Proofs       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────▶│  Skej Protocol  │◄─────────────┘
                        │                 │
                        │ • ZK Matching   │
                        │ • Event System  │
                        │ • ZRC Payments │
                        │ • AI Agent APIs │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   User Layer    │
                        │                 │
                        │ Web Interface   │
                        │ Mobile Apps     │
                        │ AI Agent SDKs   │
                        │ API Endpoints   │
                        └─────────────────┘
```

### Technical Architecture

#### Layer 1: Identity Resolution
```
ENS Domain → Ethereum Address → Calendar Endpoint
alice.eth → 0x123... → ipfs://QmABC.../calendar.json
```

#### Layer 2: Privacy-Preserving Matching
```
ZK Circuit: MutualAvailability
├── Private Inputs: Full calendars A & B
├── Public Inputs: Proposed time slots
└── Output: Proof of mutual availability (no calendar leak)
```

#### Layer 3: Decentralized Coordination
```
Zircuit Smart Contracts
├── SchedulingCore: Meeting proposals & confirmations
├── PaymentHandler: ZRC token integration
├── ZKVerifier: Availability proof verification
└── EventEmitter: Decentralized notifications
```

#### Layer 4: Economic Layer
```
ZRC Token Integration
├── Premium Features: Priority scheduling, extended slots
├── Agent Fees: AI agents charge for scheduling services  
├── Network Fees: Protocol sustainability
└── Staking Rewards: Calendar reliability incentives
```

### Data Flow Architecture

```
1. ENS Resolution     →  2. Privacy Matching  →  3. ZRC Payment
   alice.eth             ZK Proof Generation      Premium Features
   ↓                     ↓                        ↓
   Calendar Endpoint     Mutual Slots Found       Transaction Fee
   
4. Confirmation       →  5. Notification
   On-chain Proof        Event System
   ↓                     ↓
   Meeting Scheduled     All Parties Notified
```

---

## How It Works

### User Journey: Human Users

1. **Setup**
   - Connect ENS address (alice.eth)
   - Upload encrypted availability to IPFS
   - Update ENS content record to point to calendar
   - Stake ZRC tokens for premium features

2. **Scheduling Flow**
   - Request meeting with bob.eth
   - Skej resolves ENS → calendar endpoint
   - ZK circuit finds mutual availability privately
   - Present only overlapping slots to both parties
   - Both select preferred slot, pay ZRC token fee if premium
   - Meeting confirmed on Zircuit with ZK proof

3. **Privacy Guarantees**
   - Neither party sees other's full calendar
   - Only mutual free slots revealed
   - Meeting details encrypted per party
   - Blockchain records only proof-of-meeting

### User Journey: AI Agents

1. **Autonomous Setup**
   - Deploy with ENS identity (scheduler-ai.eth)
   - Configure scheduling preferences via smart contract
   - Maintain ZRC token balance for operations

2. **Scheduling Automation**
   - Monitor Zircuit events for scheduling requests
   - Generate ZK proofs of availability automatically
   - Execute complex scheduling logic (multi-party, recurring)
   - Charge ZRC tokens for premium AI scheduling services

3. **Cross-Agent Coordination**
   - AI agents can schedule with other AI agents
   - Batch operations for efficiency
   - Reputation system via on-chain history

---

## Token Mechanics (ZRC Integration) - this is really made up at this point

### Revenue Streams
- Premium Scheduling, AI Agent Services, Calendar Analytics, Enterprise Features

### Token Utility
- Gas Abstraction, Feature Access, Agent Payments, Staking Rewards, Governance

### Economic Model
- Fee Distribution

---

## Market Research

### Total Addressable Market
- **Global scheduling software**: $3.5B (2024) → $8.1B (2030)
- **Enterprise calendar management**: $2.1B annually
- **AI agent economy**: $50B+ projected by 2030
- **Web3 identity systems**: 5M+ ENS domains, growing 40% YoY

### Target Segments

#### Primary: Web3 Natives (0-18 months)
- ENS domain owners (5M+)
- Freelancers, creators
- AI agent developers and operators

### Competitive Analysis
| Solution | Privacy | Decentralized | AI-Friendly | Cost |
|----------|---------|---------------|-------------|------|
| Calendly | ❌ | ❌ | ❌ | $$ |
| Doodle | ❌ | ❌ | ❌ | $ |
| **Skej** | ✅ | ✅ | ✅ | $ |

---

## Why It Matters - "Stripe/API for Time"

### For Individual Users
- **Privacy Protection**: Coordinate meetings without exposing full calendar contents
- **True Ownership**: Your scheduling data remains under your control
- **Cross-Platform**: Works with any ENS-compatible application
- **Cost Effective**: Micro-payments only for premium features

### For AI Agents
- **First-Class Citizens**: Native blockchain integration for autonomous agents
- **Economic Incentives**: Monetize scheduling intelligence and services
- **Scalable Operations**: Handle thousands of scheduling requests affordably
- **Interoperability**: Coordinate across different AI systems

### For the Web3 Ecosystem
- **Infrastructure Layer**: Critical missing piece for ENS utility
- **Privacy Innovation**: Demonstrates ZK applicability beyond finance
- **Adoption Driver**: Practical utility encouraging ENS adoption

---

## Future Development Plans

### Phase 1: Core Protocol (Months 1-6)
- Deploy Skej contracts on Zircuit testnet
- Implement basic ZK availability matching
- Build ENS resolution and IPFS integration
- Create web interface for human users
- **Milestone**: 1,000 successful privacy-preserving meetings

### Phase 2: AI Agent Integration (Months 6-12)
- Release AI agent SDKs and APIs
- Implement ZRC token payment systems
- Advanced ZK circuits for complex scheduling
- Mobile applications for mainstream users

### Long-term Vision
- AI agent economy built on Skej primitives
- Enable new matching apps
- Privacy-first scheduling standard

---

## Team Background

### Miri - Founder
- **Background**: Product founder with VC background and 8ys in blockchain
- **Previous Experience**: Built a zk-use case consumer app used at Devcon (DIP-45) last year
- **Expertise**: Consumer apps, product and traction
- **Vision**: Passionate about creating privacy-enhancing infrastructure that can enable new ways of doing things
- **Technical Skills**: Zupass, 0xparc SDK, Supabase, Cursor with AI, experimentative CPO

---

## Success Metrics

### Technical, Economic, Adoption Metrics
- **Gas Efficiency**: low fees per scheduling interaction on Zircuit
- **Privacy Preservation**: ZK proofs ensure no calendar information leakage
- **Performance**: meeting confirmation within seconds
- **AI Agent Integration**: launch active agents
- **Transaction Volume**: ZRC token volume
- **Revenue Growth**: Generate fees
- **Token Utility**: % ZRC tokens actively staked/used

---

## Conclusion

**Skej represents the future of scheduling: private, decentralized, AI-friendly, and economically sustainable. Built on Zircuit's cutting-edge infrastructure, we're creating the missing scheduling layer for the Web3 economy.**

By leveraging Zircuit's unique capabilities - sequencer security, account abstraction, and network performance - Skej enables scheduling coordination that's impossible on any other blockchain. We're not just building another scheduling app; we're creating the infrastructure for a privacy-first, AI-native scheduling economy.

The scheduling problem meets Web3 innovation. **This is how we solve it.**
