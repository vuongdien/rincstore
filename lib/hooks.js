import { collection, doc, getDoc, getDocs, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, firestore } from '@lib/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'

//! test lint
// Custom hook to read  auth record and user profile doc
export function useUserData() {
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(null)
    const [role, setRole] = useState("anonymous")
    const [shoppingCart, setShoppingCart] = useState([])

    useEffect(() => {
        //? turn off realtime subscription
        let unsubscribe, cartUnsubscribe

        if (user) {
            const ref = doc(firestore, 'users', user.uid)
            //$ define our realtime subscriptions, because when we call ref.onsnapshot firebase return 
            //$ a function when called will unsubscribe from that data
            unsubscribe = onSnapshot(ref, (doc) => { 
                //? provide us with the latest document infomation from the database, and when the database updates it will run with
                //? the latest data
                setUsername(doc.data()?.username) 
                setRole(doc.data()?.role.value) 
            })

            const cartRef = collection(firestore, 'users', user.uid, 'shoppingCart')
            cartUnsubscribe = onSnapshot(cartRef, querySnapshot => 
                setShoppingCart(querySnapshot?.docs.map((doc) => {
                    if(shoppingCart.every((cart) => cart.slug === doc.data().slug)){
                        return {id: doc.id, item: doc.data()}
                    }else return
                }))
            )
        } else {setUsername(null), setRole("anonymous"), setShoppingCart([])}

        return unsubscribe, cartUnsubscribe
    }, [user])
    return { user, role, username, shoppingCart }
}

export function useSliderControl(length, interval){
    const [sliderIndex, setSliderIndex] = useState(0)
    
    const lastIndex = length - 1
    useEffect(() => {
        if (sliderIndex < 0) setSliderIndex(lastIndex)
        if (sliderIndex > lastIndex) setSliderIndex(0)

        let autoSlider = setInterval(() => {
            setSliderIndex(sliderIndex + 1)
        }, interval)
        return () => {clearInterval(autoSlider)}
    }, [sliderIndex, interval, lastIndex])

    return [sliderIndex, setSliderIndex]
}

export function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        windowWidth: undefined,
        windowHeight: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                });
            }
        
            // Add event listener
            window.addEventListener("resize", handleResize);
        
            // Call handler right away so state gets updated with initial window size
            handleResize();
        
            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export function useGetUser(uid){
    const [userDataState, setUserDataState] = useState({})
    
    useEffect(() => {
        let unsubscribe
        if(uid){
            const userRef = doc(firestore, "users", uid)
            unsubscribe = onSnapshot(userRef, (doc) => { 
                setUserDataState({uid: uid, user: doc.data()}) 
            })
        } else {setUserDataState({})}
        
        return unsubscribe
    }, [uid])
    
    return {userDataState}
}