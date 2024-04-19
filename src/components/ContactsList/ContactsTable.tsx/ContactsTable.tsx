import { ContactAwaitingAcceptance, ContactConfirmed } from '@/api/types/contact';
import { Loader } from '@/components/Loader';
import {
  LargeTd,
  LargeTh,
  MediumTd,
  MediumTh,
  NoDataInfo,
  Table,
  TableWrapper,
} from '@/components/TransactionHistory/TransactionTable/TransactionTable.styles';
import { SetPaymailButton } from '@/components/TransferForm/SetPaymailButton';
import { FC, useMemo, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { VerifyModal } from '../_modals';
import { SmallButton } from '@/components/Button';
import { AcceptReject } from '../AcceptReject';
import { useContacts } from '@/providers';
import { ErrorBar } from '@/components/ErrorBar';
import { useSortedContacts } from './useSortedContacts';
import { JustAddedContactMsg } from './JustAddedContcatMsg';

export const ContactsTable: FC = () => {
  const { contacts, loading, error, refresh } = useContacts();
  const [contactIdForVerification, setContactIdForVerification] = useState<string | null>(null);
  const [justAddedContact, setJustAddedContact] = useState(false);

  const contactForVerification = useMemo(() => {
    return contacts?.find((contact) => contact.paymail === contactIdForVerification);
  }, [contactIdForVerification, contacts]);

  const openVerificationWindow = (peerPaymail: string, justAdded = false) => {
    setJustAddedContact(justAdded);
    setContactIdForVerification(peerPaymail);
  };

  const sortedContacts = useSortedContacts(contacts);

  if (error) {
    return <ErrorBar errorMsg="Failed to load contacts" />;
  }

  return (
    <>
      {loading && <Loader />}
      <TableWrapper>
        {!sortedContacts ? (
          <NoDataInfo>No contacts yet</NoDataInfo>
        ) : (
          <Table>
            <thead>
              <tr>
                <LargeTh>Paymail</LargeTh>
                <MediumTh>Name</MediumTh>
                <MediumTh>Status</MediumTh>
                <MediumTh>Actions</MediumTh>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.map(({ paymail, status, fullName }) => (
                <tr key={paymail} style={{ height: 50 }}>
                  <LargeTd>{paymail}</LargeTd>
                  <MediumTd>{fullName}</MediumTd>
                  <MediumTd>
                    <StatusBadge status={status} />
                  </MediumTd>
                  <MediumTd>
                    {status !== ContactAwaitingAcceptance ? (
                      <SmallButton
                        variant="accept"
                        onClick={() => {
                          openVerificationWindow(paymail);
                        }}
                      >
                        Show code
                      </SmallButton>
                    ) : (
                      <AcceptReject
                        paymail={paymail}
                        onAccept={() => {
                          openVerificationWindow(paymail, true);
                          refresh();
                        }}
                        onReject={refresh}
                      />
                    )}
                    <SetPaymailButton paymail={paymail} variant={status === ContactConfirmed ? 'accept' : 'primary'} />
                  </MediumTd>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableWrapper>
      {contactForVerification && (
        <VerifyModal
          peer={contactForVerification}
          onConfirmed={refresh}
          onClose={() => {
            setContactIdForVerification(null);
            setJustAddedContact(false);
          }}
        >
          {justAddedContact && contactForVerification.status === 'unconfirmed' && <JustAddedContactMsg />}
        </VerifyModal>
      )}
    </>
  );
};
