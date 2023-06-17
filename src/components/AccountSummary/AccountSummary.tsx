import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { DashboardTile } from '@/components/DashboardTile'
import { BalanceValue, Currency } from '@/components/AccountSummary/AccountSummary.styles'
import { Column, Row } from '@/styles/grid'

export const AccountSummary = () => {
  return (
    <DashboardTile tileTitle="Your total balance" paymail="afr@bux.com" titleIcon={<AccountBalanceWalletIcon />}>
      <Row>
        <Column>
          <BalanceValue mainValue>
            1 000 <Currency>BSV</Currency>
          </BalanceValue>
          <BalanceValue>
            24 950 <Currency>USD</Currency>
          </BalanceValue>
          <BalanceValue>
            22 860 <Currency>EUR</Currency>
          </BalanceValue>
        </Column>
      </Row>
    </DashboardTile>
  )
}