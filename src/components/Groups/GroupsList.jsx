import React from 'react'
import GroupListItem from './GroupListItem'

const GroupsList = ({w="100%", myGroups,chatId }) => {

  return (
    <div className=' flex flex-col gap-3'>

        {
            myGroups.length>0 ? myGroups.map((group)=>(
                <GroupListItem group={group} chatId={chatId} key={group._id} />
            )):<p>No Groups</p>
        }

    </div>
  )
}

export default GroupsList