import * as React from 'react';

class MyChatPeoples extends React.Component {
  static propTypes = {
    users: React.PropTypes.array,
    newUserSelectedForChat: React.PropTypes.func,
    myChatSelectedUserId: React.PropTypes.number,
  }
  render() {
    const { users, newUserSelectedForChat } = this.props;
    return (
      <div>{
        users.map((usr) => {
          return (
          <div onClick={()=> newUserSelectedForChat(usr.id)} className={'chatRoomUser' + (usr.id === this.props.myChatSelectedUserId ? ' chatRoomUser-selected' : '')}>{usr.name}</div>
          );
        })
      }</div>
    );
  }
}
export default MyChatPeoples;
