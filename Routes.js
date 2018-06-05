import {createStackNavigator} from "react-navigation";
import OrderStatuses from "./components/order_statuses/OrderStatuses";
import Customers from "./components/customers/Customers";
import ChairTypes from "./components/chair_types/ChairTypes";
import Chairs from "./components/chairs/Chairs";
import ChairGallery from "./components/chair_gallery/ChairGallery";
import Orders from "./components/orders/Orders";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

export const AdNav = createStackNavigator({

        Home: {
            screen: Login
        },

        Register: {
            screen: Register
        },

        Orders: {
            screen: Orders
        },

        ChairTypes: {
            screen: ChairTypes
        },

        OrderStatuses: {
            screen: OrderStatuses
        },


        Customers: {
            screen: Customers
        },

        Chairs: {
            screen: Chairs
        },
        ChairGallery: {
            screen: ChairGallery
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);