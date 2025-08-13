import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database connection test failed:', error)
      return { success: false, error }
    }

    console.log('✅ Database connection successful')
    return { success: true, data }
  } catch (err) {
    console.error('Database connection test failed:', err)
    return { success: false, error: err }
  }
}

export async function testProfilesTable() {
  try {
    // Test profiles table access
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)

    if (error) {
      console.error('Profiles table test failed:', error)
      return { success: false, error }
    }

    console.log('✅ Profiles table accessible, found', data?.length || 0, 'profiles')
    return { success: true, data }
  } catch (err) {
    console.error('Profiles table test failed:', err)
    return { success: false, error: err }
  }
}
