/**
 * シミュレーション用のdppファイルを生成するユーティリティ
 */

/**
 * 広域シミュレーション用のdppファイル内容を生成する
 * @param meshCode メッシュコードの配列
 * @param earthquakePreset 地震動データ名
 * @param uuid シミュレーション用のUUID
 * @returns dppファイルの内容
 */
export const generateWideDppContent = (
	meshCode: string[],
	earthquakePreset: string,
	uuid: string
): string => {
	// UUIDを使用して出力ディレクトリ名を生成
	const outputDir = `output/${uuid}`;

	// DPPファイルの内容を生成
	const content = `////////////////////////////////////////////////////////////////////////////////
tiles = [
${meshCode.map((tile) => `"${tile}"`).join(',\n')}
];
odirVTK = "${outputDir}/VTK/";
odirSHP = "${outputDir}/SHP/";
NMB_MPI_NODE=8;
////////////////////////////////////////////////////////////////////////////////
var ret01;
{
  f = @recipe("");
  ret01 = f( tiles=tiles );
  ret01.register();
}
var ret02;
{
  f = @recipe("");
  a = ret01["GISSet.dat"];
  b = ret01["IES_SRA/"];
  wavs = @data("");
  c = wavs[""];
  ret02 = f(a, b, c, STEP_STRIDE=1 );
  ret02.register();
}
var ret03;
{
  f = @recipe("");
  a = ret02["IESDATA/Shapes"];
  b = ret02["IESDATA/Wave"];
  c = ret02["data/GISSet.dat"];
  d = ret02["data/config.dat"];
  e = ret02["data/eq_source.dat"];
  ret03 = f(a, b, c, d, e, MPI_SRA=NMB_MPI_NODE );
  ret03.register();
}
var ret04;
{
  f = @recipe("");
  ret04 = f(ret03);
//  ret04.register();
  ret04.register( s3_role_arn="",
                  s3_role_session_name="",
                  s3_bucket_name="",
                  s3_bucket_put_path=odirVTK );
  ret01["shapeset"].register( s3_role_arn="",
                  s3_role_session_name="",
                  s3_bucket_name="",
                  s3_bucket_put_path=odirSHP, fin_fname="done" );
}`;

	return content;
};
