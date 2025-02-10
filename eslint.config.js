import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'; // プラグインをインポート


export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		plugins: {
			'unused-imports': unusedImports,
			'prefer-arrow-functions': preferArrowFunctions, // プラグインを登録
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'cdk/']
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn', // 未使用の変数を警告
			'@typescript-eslint/no-explicit-any': 'warn', // any の使用を警告
			'no-unused-vars': 'off', // デフォルトの no-unused-vars を無効化
			'unused-imports/no-unused-imports': 'error', // 未使用のインポートをエラーに
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_'
				}
			],
			'no-restricted-imports': 'off', // 制限されたインポートを無効化
			'func-style': 'error', // 関数の書き方を統一する func-styleはだめ
			'prefer-arrow-functions/prefer-arrow-functions': [
				"error", // エラーとして報告する（違反がある場合はビルドが失敗する設定）
				{
					"classPropertiesAllowed": false, // クラスプロパティ内で通常の関数（functionキーワード）を許可しない
					"disallowPrototype": false, // プロトタイプメソッドでは通常の関数を許可する（アロー関数の使用を強制しない）
					"returnStyle": "unchanged", // 関数の戻り値スタイルを変更しない（return文の形に影響を与えない）
					"singleReturnOnly": false // 単一のreturn文のみを持つ関数に限定しない（複数のreturn文を許可する）
				}
			],
			'no-implicit-coercion': 'error', // 暗黙的な型変換を禁止
			'no-fallthrough': 'error', // case文のfallthroughを禁止
			"no-restricted-globals": 'error' // 制限されたグローバル変数を禁止
		}
	}
);
