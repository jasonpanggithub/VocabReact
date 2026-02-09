import List from '../pages/List/List'
import Add from '../pages/Add/Add'
import Capture from '../pages/Capture/Capture'
import Similar from '../pages/Other/SimilarSpelling'
import SimilarPronunciation from '../pages/Other/SimilarPronunciation'
import Review from '../pages/Other/Review'
import ByDate from '../pages/Dictation/ByDate/ByDate'
import ByFail from '../pages/Dictation/ByFail/ByFail'
import TNPlus from '../pages/Dictation/TNPlus/TNPlus'
import Edit from '../pages/Edit/Edit'

const navItems = [
  { path: '/list', label: 'List', element: <List /> },
  { path: '/add', label: 'Add', element: <Add /> },
  { path: '/capture', label: 'Capture', element: <Capture /> },
  {
    label: 'Dictation',
    children: [
      { path: '/dictation/by-date', label: 'By Date', element: <ByDate /> },
      { path: '/dictation/by-fail', label: 'By Fail', element: <ByFail /> },
      { path: '/dictation/tn-plus', label: 'TN+', element: <TNPlus /> },
    ],
  },
  {
    label: 'Other',
    children: [
      {
        path: '/similar',
        label: 'Similar Spelling',
        element: <Similar />,
      },
      {
        path: '/other/similar-pronunciation',
        label: 'Similar Pronunciation',
        element: <SimilarPronunciation />,
      },
      {
        path: '/other/review',
        label: 'Review',
        element: <Review />,
      },
    ],
  },
  { path: '/edit/:id', element: <Edit /> },  // though it is not shown in the menu, we keep it here for routing purposes
]

export default navItems
