import { View,Text, TouchableOpacity,Image } from "react-native";
import { useFonts,poppins_400Regular,Poppins_700Bold } from "@expo-google-fonts/poppins"


export default function Loginpage() {
    return(
        <View style={{backgroundColor:"#1E1E1E",width:"100%",height:"100%"}}>
            <Image style={{width:200,height:100,marginVertical:225,height:130,marginLeft:100}} source={require("./assets/xeroai.png")}/>
            <TouchableOpacity style={{backgroundColor:"#FFFFFF",width:360,height:51,alignItems:"center",padding:10,marginTop:-30,borderRadius:50,marginLeft:22,flexDirection:"row"}} ><Image style={{width:32,height:30,marginHorizontal:70}} source={require("./assets/google_icon.png")}></Image><Text style={{ fontSize:16,fontWeight:"bold",marginHorizontal:-60,fontFamily:"poppins_700Bold"}}>Continue With Google</Text></TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:"#393838",width:360,height:51,alignItems:"center",padding:10,borderRadius:50,marginLeft:30,marginVertical:20,marginLeft:22,}} ><Text style={{ color:"#FFFAFA", fontSize:16,fontWeight:"bold",marginHorizontal:-60,marginVertical:5,fontFamily:"poppins_400Regular"}}>Continue With email</Text></TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:"#393838",width:360,height:51,alignItems:"center",padding:10,borderRadius:50,marginLeft:30,flexDirection:"row",marginLeft:22,}} ><Text style={{ color:"#FFFAFA", fontSize:16,fontWeight:"bold",marginLeft:140,fontFamily:"poppins_400Regular"}}>Log in</Text><Image style={{width:44,height:55,}} source={require("./assets/login_icon.png")}/></TouchableOpacity>
            <View style={{flexDirection:"row",marginLeft:100,marginVertical:"100",gap:40}}>
            <Text style={{color:"#696969"}}>Privacy policy</Text>
            <Text style={{color:"#696969",}}>terms of service</Text>
            </View>

            



        </View>
    )
}