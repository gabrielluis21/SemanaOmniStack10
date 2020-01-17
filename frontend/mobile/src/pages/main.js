import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'; 
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'
import { connect, disconnect, subscribeToNewDevs } from '../services/socket'

function Main({ navigation }){
    const [devs, setDevs] = useState([]);
    const [ currentLocation, setCurrentLocation] = useState(null);
    const [techs, setTechs] = useState('');
    
    useEffect(() => {
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync();
            if(granted){
                const location = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = location.coords;
                setCurrentLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                })
            }
        }

        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    function setUpWebSocket(){
        disconnect();
        
        const { latitude, longitude } = currentLocation;
        
        connect(
            latitude,
            longitude,
            techs,
        );
    }

    async function loadDevs() {
        const { latitude, longitude } = currentLocation;
        
        const response = await api.get('/search', {
            latitude,
            longitude,
            techs: techs
        })

        setDevs(response.data.devs);
        setUpWebSocket();
    }

    async function handleChangeRegion(region) {
        setCurrentLocation(region);
    }

    if(!currentLocation) 
        return null;
    
    return (
      <>
        <MapView onRegionChangeComplete={handleChangeRegion}
          initialRegion={currentLocation} style={styles.map} >
            {
                devs.map(dev => (
                   <Marker key={dev._id}
                    coordinate={{ 
                      latitude: dev.location.coordinates[1],
                      longitude: dev.location.coordinates[0] 
                      }} >
                     <Image style={styles.avatar} 
                     source={ { uri: dev.avatar_url } } />
    
                     <Callout onPress={()=>{
                        navigation.navigate('Profile', { github_username: dev.github_username });
                      } }>
                        <View style={styles.callout} >
                            <Text style={styles.devName} >{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                            <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                        </View>
                     </Callout>
                   </Marker>
                  )
                )
            }
        </MapView>
        <View style={styles.searchForm}>
          <TextInput 
            style={styles.searchInput} 
            placeholder='Buscar devs por tecnologia...'
            placeholderTextColor='#999'
            autoCapitalize='words'
            autoCorrect={false}
            value={techs}
            onChangeText={setTechs}
          />
          <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
            <MaterialIcons name='my-location' fontSize={30} color='#FFF'/>
          </TouchableOpacity>
        </View>
      </>
    );

    
}

const styles = StyleSheet.create({
    map: { 
        flex: 1,
    },
    avatar:{
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
    },
    devName:{
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio:{
        color: '#666',
        marginTop: 5,
    },
    devTechs:{
        marginTop: 5
    },
    searchForm:{
        position:'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection:'row',

    },
    searchInput:{
        flex: 1,
        height: 50,
        backgroundColor:'#FFF',
        color:'#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor:'#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 4,
            width: 4
        },
        elevation: 2,
    },
    loadButton:{
        width: 50,
        height: 50,
        backgroundColor: '#8E4DFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,

    },
});

export default Main;

