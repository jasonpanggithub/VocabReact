import List from '../pages/List/List'
import Add from '../pages/Add/Add'
import ByDate from '../pages/Dictation/ByDate/ByDate'
import TNPlus from '../pages/Dictation/TNPlus/TNPlus'
import Edit from '../pages/Edit/Edit'

const navItems = [
  { path: '/list', label: 'List', element: <List /> },
  { path: '/add', label: 'Add', element: <Add /> },
  {
    label: 'Dictation',
    children: [
      { path: '/dictation/by-date', label: 'By Date', element: <ByDate /> },
      { path: '/dictation/tn-plus', label: 'TN+', element: <TNPlus /> },
    ],
  },
  { path: '/edit/:id', element: <Edit /> },  // though it is not shown in the menu, we keep it here for routing purposes
]

export default navItems
