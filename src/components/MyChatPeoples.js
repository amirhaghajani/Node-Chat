import * as React from 'react';
import { Button } from 'react-bootstrap';

class MyChatPeoples extends React.Component {
  static propTypes = {
    users: React.PropTypes.array,
    newUserSelectedForChat: React.PropTypes.func,
  }
  render() {
    const { users, newUserSelectedForChat } = this.props;
    return (
      <div>{
        users.map((usr) => {
          return (<Button onClick={()=> newUserSelectedForChat(usr.id)}>{usr.name}</Button>);
        })
      }</div>
    );
  }
}
export default MyChatPeoples;
