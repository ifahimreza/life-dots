import {NextResponse} from "next/server";
import {createSupabaseAdminClient} from "../../../../libs/supabaseAdmin";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Missing Supabase server credentials.";
    return NextResponse.json({error: message}, {status: 500});
  }

  const {data: authData, error: authError} = await supabase.auth.getUser(token);
  const userId = authData?.user?.id;
  if (authError || !userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const {error: profileError} = await supabase.from("profiles").delete().eq("id", userId);
  if (profileError) {
    return NextResponse.json({error: profileError.message}, {status: 500});
  }

  const {error: deleteError} = await supabase.auth.admin.deleteUser(userId, true);
  if (deleteError) {
    return NextResponse.json({error: deleteError.message}, {status: 500});
  }

  return NextResponse.json({success: true});
}
