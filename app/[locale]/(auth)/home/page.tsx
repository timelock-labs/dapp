'use client';

import LoggedHome from './components/LoggedHome'
import NotLogIn from './components/NotLogIn';
import { useAccount } from 'wagmi'; 


export default function Home() {
const { isConnected } = useAccount(); // 获取真实的钱包连接状态

  
  

  return (<>
  {
    !isConnected ?<LoggedHome /> :<NotLogIn/>
  }
  </>
   
  );
}