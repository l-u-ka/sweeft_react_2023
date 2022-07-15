import { useNavigate, useParams } from "react-router-dom"
import React from 'react'
import Card from '../components/Card'


export default function Details(props) {
    

    const [loading, setLoading] = React.useState(true);
    const [userData, setUserData] = React.useState({});
    const [company, setCompany] = React.useState({});
    const [address, setAddress] = React.useState({});

    const [allFriends, setAllFriends] = React.useState([]);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [isMoreLeft, setIsMoreLeft] = React.useState(true);

    /*
    let navigate = useNavigate()
    function navigation(id) {
      navigate('./', {state: {id: id}})
      window.location.reload(false)
    }*/

    //const location = useLocation();

    let {idParam} = useParams();
    // get parameter from the url and set it as id, since the id was passed as parameter in home page
    const [id, setId] = React.useState();
    React.useEffect(()=>setId(idParam), [idParam])

    // navigate on the same page with different parameter
    let navigate = useNavigate()
    function navigation(id) {
      navigate(`/user/${id}`)
      window.scrollTo(0, 0)
    }

    // getting api call every time page number changes and storing the info of user's friends in allFriends state
    React.useEffect(()=>{
      fetch(`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${id}/friends/${pageNumber}/20`)
        .then(response => {
          if(response.ok) {
            return response.json();
          } throw response;
        }).then(usersInfo => {
          setAllFriends([...new Set([...allFriends, ...usersInfo.list])])
          setIsMoreLeft((usersInfo.pagination.nextPage !== null) ? true : false);
        })
        .catch(error => console.error(error))
        .finally(()=> {
          setLoading(false)
        }) 
    }, [pageNumber])

    // getting api call every time id of the user changes and storing it in allFriends state
    React.useEffect(()=>{
      fetch(`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${id}/friends/${pageNumber}/20`)
        .then(response => {
          if(response.ok) {
            return response.json();
          } throw response;
        }).then(usersInfo => {
          setAllFriends([...new Set([...usersInfo.list])])
          setIsMoreLeft((usersInfo.pagination.nextPage !== null) ? true : false);
        })
        .catch(error => console.error(error))
        .finally(()=> {
          setLoading(false)
        }) 
    }, [id]) 
    

    // getting api call of user's details every time id of the user changes and storing it in UserData state
    React.useEffect(
        ()=> {
          fetch(`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${id}`)
          .then(response => {
            if(response.ok) {
              return response.json();
            } throw response;
          }).then(userInfo => {
            setUserData(userInfo);
            setCompany(userInfo.company);
            setAddress(userInfo.address);
          })
          .catch(error => console.error("Error fetching data"))
          .finally(()=> {
            setLoading(false)
          })
        }, [id]
    )

    
    // useCallback hook to check if last user is intersecting with the page and increasing page number
    const userObserver = React.useRef();
    const userLastRef = React.useCallback(node => {
      if(loading) return
      if(userObserver.current) userObserver.current.disconnect();
      userObserver.current = new IntersectionObserver(entries=> {
        if(entries[0].isIntersecting && isMoreLeft) {
          setPageNumber(prev => prev + 1)
        }
      })
      if(node) userObserver.current.observe(node);
    }, [loading, isMoreLeft]);



    return (
        <>
        <div className="user">
            <img alt = "userProfilePicture" className="user--pic" src={`${userData.imageUrl}?${userData.id}`}></img>
            <div className="user--title_name">
                <h1 className="user--name">{userData.prefix + " " + userData.name + " " + userData.lastName}</h1>
                <h3 className="user--title">{userData.title}</h3>
            </div>
            <div className="user--info">
              <div className="user--info--ocupation">
                  <h3>Info</h3>
                  <p className="user--email"><span>Email: </span>{userData.email}</p>
                  <p className="user--ip"><span>IP Adress: </span>{userData.ip}</p>
                  <p className="user--jobArea"><span>Job Area: </span>{userData.jobArea}</p>
                  <p className="user--jobType"><span>Job Type: </span>{userData.jobType}</p>
              </div>
              <div className="user--adress">
                <h3>Address</h3>
                <p className="user--company"><span>Company: </span>{company.name + " " + company.suffix}</p>
                <p className="user--city"><span>City: </span>{address.city}</p>
                <p className="user--country"><span>Country: </span>{address.country}</p>
                <p className="user--state"><span>State: </span>{address.state}</p>
                <p className="user--streetAddress"><span>Street Address: </span>{address.streetAddress}</p>
                <p className="user--zipCode"><span>Zip Code: </span>{address.zipCode}</p>
              </div>
            </div>
        </div>
        <div>
          <div className="user--friends">Friends</div>
            <div className="cards_container">
              {allFriends.map((user, index) => {
                if(index===allFriends.length-1) {
                  return <Card ref={userLastRef} key={user.id} imageUrl={`${user.imageUrl}?${user.id}`} name={user.name} lastName={user.lastName} title={user.title} prefix={user.prefix} id={user.id} navigationFunction={navigation}/>
                } else {
                  return <Card key={user.id} imageUrl={`${user.imageUrl}?${user.id}`} name={user.name} lastName={user.lastName} title={user.title} prefix={user.prefix} id={user.id} navigationFunction={navigation}/>
                }
              }) 
              }  
            </div>
        </div>
        {loading && <div>loading...</div>}
        </>
    )
}