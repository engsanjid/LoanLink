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

      {/* Manager Inventory */}
      <MenuItem
        icon={MdHomeWork}
        label="My Inventory"
        address="my-inventory"
      />

      {/* Manage Loans */}
      <MenuItem
        icon={MdOutlineManageHistory}
        label="Manage Loans"
        address="manage-loans"
      />
    </>
  )
}

export default ManagerMenu
