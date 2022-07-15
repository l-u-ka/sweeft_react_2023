import React from 'react';
import Card from '../components/Card'
import {useNavigate} from 'react-router-dom'

export default function Home() {
    const [allUsers, setAllUsers] = React.useState([]);   //state to save all user info from api call
    const [loading, setLoading] = React.useState(true);   
    const [pageNum, setPageNum] = React.useState(1);
    const [isMore, setIsMore] = React.useState(true);
    
    // function to navigate to user path with id of the user passed as parameter
    let navigate = useNavigate()
    function navigatation(id) {
        navigate(`./user/${id}`)
    }
    
      // getting api call and storing it in allUsers state
      React.useEffect(
      ()=> {
        fetch(`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${pageNum}/12`)
        .then(response => {
          if(response.ok) {
            return response.json();
          } throw response;
        }).then(usersInfo => {
          setAllUsers([...new Set([...allUsers, ...usersInfo.list])])
          setIsMore((usersInfo.pagination.nextPage !== null) ? true : false);
        })
        .catch(error => console.error("Error fetching data"))
        .finally(()=> {
          setLoading(false)
        }) // eslint-disable-next-line
      }, [pageNum]
    )
  
    // useCallback hook to check if the last element is intersecting with the current page and increasing page number if so
    const observer = React.useRef();
    const lastUserRef = React.useCallback(node => {
      if(loading) return
      if(observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries=> {
        if(entries[0].isIntersecting && isMore) {
          setPageNum(prev => prev + 1)
        }
      })
      if(node) observer.current.observe(node);
    }, [loading, isMore]);

    return (
      <>
      <div className="cards_container">
        {allUsers.map((user, index) => {
          if(index===allUsers.length-1) {
            return <Card ref={lastUserRef} key={user.id} imageUrl={`${user.imageUrl}?${user.id}`} name={user.name} lastName={user.lastName} title={user.title} prefix={user.prefix} id={user.id} navigationFunction={navigatation}/>
          } else {
            return <Card key={user.id} imageUrl={`${user.imageUrl}?${user.id}`} name={user.name} lastName={user.lastName} title={user.title} prefix={user.prefix} id={user.id} navigationFunction={navigatation}/>
          }
        })}   
      </div>
      {loading && <div>loading...</div>}
      </>
    )
}
