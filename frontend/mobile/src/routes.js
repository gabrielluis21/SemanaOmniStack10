import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/main';
import Profile from './pages/profile'

const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: 'Dev Radar',
            },
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Perfil no GitHub',
            },
        },
    },{
        defaultNavigationOptions: {
            headerTintColor: '#fff',
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: '#7D40E7',
            }
        }
    }
    )
);

export default Routes;