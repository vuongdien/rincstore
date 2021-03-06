import Link from "next/link";
import { UserContext } from "@lib/globalContext";
import { useContext } from "react";

export default function AuthCheck(props){
    const { role } = useContext(UserContext)

    return role === "admin"
        ? props.children
        : props.fallback || <Link passHref href={`/`}>
            <div className="fallBack">
                <a>Admin privileges required, return to home</a>
            </div>
        </Link>
}
