import java.util.*;

class A{
	public static void main(String[] args){
		Scanner scan = new Scanner(System.in);
		int t = scan.nextInt();
		for(int i=0; i<t; i++){
			int n,x1,y;
			n = scan.nextInt();
			x1 = scan.nextInt();
			y = scan.nextInt();
			int[] array = new int[n];
			for(int x=0; x<n; x++){
				array[x] = scan.nextInt();
			}

			int ans = 0;
			for(int x=0; x<n; x++){
				if(array[x] <= x1 && array[x]%y == 0){
					ans++;
				}
			}
			System.out.println(ans);
		}
	}
}