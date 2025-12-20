import { BsFillHouseAddFill } from 'react-icons/bs'
import { MdHomeWork, MdOutlineManageHistory, MdPendingActions } from 'react-icons/md'
import MenuItem from './MenuItem'

const ManagerMenu = () => {
  return (
    <>
      {/* Add Loan */}
      <MenuItem
        icon={BsFillHouseAddFill}
        label="Add Loan"
        address="add-loan"
      />

      {/* Pending Loan Applications */}
      <MenuItem
        icon={MdPendingActions}
        label="Pending Loans"
        address="pending-loans"
      />

     <MenuItem
  icon={MdOutlineManageHistory}
  label="Approved Loans"
  address="approved-loans"
/>


     <MenuItem
  icon={MdOutlineManageHistory}
  label="Manage Loans"
  address="manage-loans"
/>

    </>
  )
}

export default ManagerMenu
