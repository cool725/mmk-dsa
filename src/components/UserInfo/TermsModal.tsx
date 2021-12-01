import { MouseEvent, SyntheticEvent, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props extends Pick<DialogProps, 'open' | 'onClose'> {}

const TermsModal: React.FC<Props> = ({ open, onClose }) => {
  // const [modalOpen, setModalOpen] = useState(open);

  const handleAfterLinkClick = useCallback(
    (event: React.MouseEvent) => {
      if (typeof onClose === 'function') {
        onClose(event, 'backdropClick');
      }
    },
    [onClose]
  );

  const handleClose = (event: MouseEvent) => {
    handleAfterLinkClick(event);
  };

  const handleAccountsClick = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <div onClick={handleAfterLinkClick}>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="mmk-terms-and-conditions-title"
        aria-describedby="mmk-terms-and-conditions-description"
      >
        <DialogTitle id="mmk-terms-and-conditions-title">{'Mymoneykarma DSA Terms and Condition'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="mmk-terms-and-conditions-description">
            <p>
              Terms &amp; Conditions for Direct Selling Agents (‘DSA’) of Mymoneykarma Infomatics India Private Limited
              (‘mymoneykarma’)
            </p>
            <ul>
              <li>
                A DSA is any individual, sole proprietorship, private or public company, partnership, or LLP engaged in
                the sphere of financial services or otherwise, having contacts through which home loan/loan against
                property leads can be generated.
              </li>
              <li>
                The DSA’s sole responsibility is to scout for loan application proposals and share those prospects with
                mymoneykarma. Mymoneykarma will complete and log those prospects under its code with the respective
                lenders.
              </li>
              <li>
                The DSA shall not represent himself/herself/themselves as official(s) of mymoneykarma &amp; shall not
                give any commitment on behalf of mymoneykarma.
              </li>
              <li>
                The empanelment of DSA with mymoneykarma is as a service provider only &amp; it does not create any
                employer – employee relationship and the DSA will not have any right to claim employment or any other
                benefit whatsoever from mymoneykarma other than what is stated in the agreement.
              </li>
              <li>
                The DSA applicant undertakes that the DSA’s constitutional documents (all licenses / permissions /
                authorizations, as may be required, under all the applicable Laws) authorize them to conduct the
                business of Direct Selling Agent (DSA).
              </li>
              <li>
                The period of empanelment will be initially for 1 year. However, at the sole discretion of mymoneykarma,
                based on the performance of the DSA, may further be extended for every 2 years by mymoneykarma.
              </li>
              <li>
                <b>The DSA shall not do any acts which may damage the integrity and reputation of mymoneykarma.</b>
              </li>
              <li>
                Either mymoneykarma or DSA may terminate this agreement without cause by giving prior written notice of
                1 (One) month. DSA will remain liable for all loan applications sourced up to and including the date of
                termination.
              </li>
              <li>
                The DSA, including its staff, shall view and process company personal data only on a need-to-know basis
                and only to the extent necessary to perform this agreement or the Company’s further written
                instructions.
              </li>
              <li>
                Upon termination of this agreement, for whatever reason, The DSA shall at the direction of the company,
                securely delete or return all relevant data and confirm the same in writing.
              </li>
              <li>
                It is the DSA’s responsibility to remain compliant with GST regulations, where applicable. If DSA is
                registered with GST, then DSA must provide correct GST details to mymoneykarma.
                <ul>
                  <li>
                    If at the time of application, DSA does not provide GST details, then it is assumed that the DSA is
                    not required to be GST registered and he/she/entity does not have a GST number.
                  </li>
                  <li>
                    If subsequent to registering as mymoneykarma DSA, the DSA obtains GST registration, then the DSA
                    must provide GST details to mymoneykarma via email to{' '}
                    <a href="/" onClick={handleAccountsClick}>
                      accounts@mymoneykarma.com
                    </a>
                    . This intimation must be provided at least 7 days prior to raising the first invoice after GST
                    registration.
                  </li>
                </ul>
              </li>
              <li>
                Payout:
                <ul>
                  <li>
                    Payment of DSA commission shall be subject to submission of original invoices in the form and manner
                    acceptable to mymoneykarma.
                  </li>
                  <li>
                    The commission amount payable by mymoneykarma to the Service Provider shall be subject to deduction
                    of Tax (“TDS”) applicable on such Fee and mymoneykarma shall only be liable to pay the balance
                    amount to the Service Provider.
                  </li>
                  <li>All GST on commission is the responsibility of the DSA.</li>
                  <li>
                    In case of GST registered DSA, DSA will need to provide proof of GST deposit on mymoneykarma
                    invoices.
                  </li>
                </ul>
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TermsModal;
