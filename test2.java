import java.util.*;

class A{
	public static void main(String[] args){
		Scanner scan = new Scanner(System.in);
		int t = scan.nextInt();
		for(int i=0; i<t; i++){
			int n = scan.nextInt();
			int x = scan.nextInt();
			int[] array = new int[n];
			int[] array2 = new int[n];
			for(int j=0; j<n; j++){
				array[j] = scan.nextInt();
				array2[j] = array[j];
			}
			Arrays.sort(array2);
			int max = array2[n-1];
			System.out.println(max - array[x]);
		}
	}
}