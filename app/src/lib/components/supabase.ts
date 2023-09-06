export const setNotification = async (supabase, id, title, message) => {
    await supabase
        .from("notifications")
        .insert([
          {
            user_id: id,
            title: title,
            message: message,
          },
        ]);
  };
export const deleteNotification = async (supabase, id) => {
        await supabase
            .from("notifications")
            .delete()
            .match({ id: id });
}
export const getFollowing = async (supabase, id) => {
    const { data, error } = await supabase
      .from('identity')
      .select('following')
      .eq('id', id);
    if (error) return [] 
    return data[0]?.following || [];
}