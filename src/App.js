import React from 'react';
import { createClient } from '@supabase/supabase-js'

class App extends React.Component {

  constructor(props) {
    super(props)

    // opcional para poder personalizar diferentes aspectos
    const options = {
      schema: 'public',
      headers: { 'x-my-custom-header': 'my-app-name' },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }

    const supabase = createClient(
      'https://gfhyobdofzshidbbnaxf.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaHlvYmRvZnpzaGlkYmJuYXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY4OTUwNzQsImV4cCI6MTk4MjQ3MTA3NH0.-MgTPuKPwfZ8xJbwoblznb9EZJUCxW6cFlYHvbjrCHs',
      options
    )

    this.supabase = supabase;
  }

  callBackOnFinishLoginForm = async (loginUser) => {

    console.log("Cambiado "+loginUser.email);
    console.log("Cambiado "+loginUser.password);

    // signUn, Create user
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: loginUser.email,
      password: loginUser.password,
    })

    if ( error == null && data.user != null ){
      this.setState({
        user : data.user
      })
    }
    
  }

  render() {
    return (
      <h1>Airplanes con supabase</h1>
    );
  }
}
export default App;





